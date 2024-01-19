import os
from datetime import datetime
import uuid
from collections import defaultdict

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import aiofiles
from fastapi import BackgroundTasks
from openai import OpenAI
from supabase import create_client, Client
from pydantic import BaseModel
from janome.tokenizer import Tokenizer

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app = FastAPI()

origins = [
    "http://localhost:3000",  # Reactの開発サーバーのURLを許可する
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)

class AnalyzeMeetingRequest(BaseModel):
    organizer_id: str

class TranscriptionRequest(BaseModel):
    transcription: str

@app.post("/transcribe/")
async def transcribe_audio(meeting_id: str, audio: UploadFile = File(...)):
    """音声ファイルを文字起こしするエンドポイント"""
    temp_file = f"temp_{audio.filename}"

    try:
        async with aiofiles.open(temp_file, 'wb') as out_file:
            content = await audio.read()
            await out_file.write(content)
     
        with open(temp_file, 'rb') as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
            # recording = _get_recoring(transcript.text)

            note_data = {
                "id": str(uuid.uuid4()),
                "transcription": transcript.text,
                "recording": "",
                "meeting_id": meeting_id,
                "status": 2,  # 処理後を意味します
                "created_at": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }
            supabase.table("note").insert(note_data).execute()

            return transcript.text

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # 一時ファイルを削除
        if os.path.exists(temp_file):
            os.remove(temp_file)

@app.post("/background_analitics_job/")
async def analyze_meeting_request(background_tasks: BackgroundTasks, request: AnalyzeMeetingRequest):
    """会議の文字起こしを分析するエンドポイント"""
    job_id = _start_background_job(request.organizer_id, 1)
    background_tasks.add_task(_analyze_meeting_notes, request.organizer_id, job_id)
    return {"message": "分析を開始しました"}

def _analyze_meeting_notes(organizer_id: str, job_id: str):
    try:
        # 既存のcrew_idに紐づくword_frequencyを削除
        supabase.table('word_frequency').delete().eq('crew_id', organizer_id).execute()
        notes = _get_transcriptions(supabase, organizer_id)
        noun_freq = _count_nouns(notes)
        _insert_word_frequencies(supabase, noun_freq, organizer_id)
        print(noun_freq)
    finally:
        print("分析を終了します")
        _finish_background_job(job_id)

def _get_transcriptions(supabase: Client, organizer_id: str):
    # meetingテーブルからorganizer_idに一致するレコードを取得
    meetings = supabase.table('meeting').select('id').eq('organizer_id', organizer_id).execute()

    transcriptions = []
    for meeting in meetings.data:
        # 各meetingに対応する最新のnoteを取得
        latest_note = supabase.table('note').select('transcription').eq('meeting_id', meeting['id']).order('updated_at', desc=True).limit(1).execute()

        # transcriptionが存在する場合はリストに追加
        if latest_note.data and latest_note.data[0]['transcription']:
            transcriptions.append(latest_note.data[0]['transcription'])

    return transcriptions

def _count_nouns(texts):
    tokenizer = Tokenizer()
    noun_freq = defaultdict(int)

    for text in texts:
        tokens = tokenizer.tokenize(text)
        for token in tokens:
            if token.part_of_speech.startswith('名詞'):
                noun_freq[token.surface] += 1

    return dict(noun_freq)

def _insert_word_frequencies(supabase: Client, noun_freq, crew_id):
    for word, frequency in noun_freq.items():
        data = {
            "id": str(uuid.uuid4()),
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat(),
            'word': word,
            'frequency': frequency,
            'crew_id': crew_id
        }
        supabase.table('word_frequency').insert(data).execute()

def _start_background_job(crew_id: str, t: int):
    job_id = str(uuid.uuid4())
    supabase.table('background_job').insert({
        'id': job_id,
        'created_at': datetime.now().isoformat(),
        'updated_at': datetime.now().isoformat(),
        'status': 1,
        "crew_id": crew_id,
        'type': t
    }).execute()
    return job_id

def _finish_background_job(job_id: str):
    supabase.table('background_job').update({
        'status': 2,
        'updated_at': datetime.now().isoformat()
    }).eq('id', job_id).execute()
    
@app.post("/refine/")
def refine_recoring(request:TranscriptionRequest):
    PROMPT = f"""
    Please convert the following #transcriptions to markdown bulleted minutes according to the output format.

    #transcription.
    {request.transcription}

    #Output format
    - Please output the minutes in Markdown format.
    - The minutes should be in Japanese.
    - Do not output any content other than the minutes.
    - If there are any decisions, please output them under the heading `### Decisions`. If there are no action items, do not output `### Decisions`.
    - If there are action items, they should be listed under the heading `### Action Items`. If there are no action items, do not print `### Action Items`.
    - Content that is neither a decision nor an action item should be printed under the heading `### Memo`. If there is neither a decision nor an action item, it should be listed under the heading `### Memo`, otherwise `### Action Item` is not needed.    
    
    #Note
    Please look at the output format again.
    """
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        messages=[
            {"role": "system", "content": "You are a seasoned web developer. You are good at HTML, CSS"},
            {"role": "user", "content": PROMPT}
        ]
    )
    recording = response.choices[0].message.content
    print(recording)
    return {"recording": recording}

# Uvicorn でサーバを起動する場合
# uvicorn main:app --reload
            
