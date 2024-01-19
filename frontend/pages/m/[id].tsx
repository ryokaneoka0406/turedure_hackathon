import { Base, Button, Heading, Section, FaPlayIcon, FaStopIcon } from "smarthr-ui";
import PageTitleSection from "../components/PageTitleSection";
import Layout from "../components/Layout";
import React, { useState, useRef } from "react";
import useSWR, { useSWRConfig } from "swr";
import { useRouter } from "next/router";
import Note from "../components/Note";

const Meeting = () => {

  const [recording, setRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { id } = router.query;

  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data: meeting, error } = useSWR(`/api/meeting/${id}`, fetcher);
  const { mutate } = useSWRConfig();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        const audioBlob = new Blob([e.data], { type: "audio/wav" });
        setAudioBlob(audioBlob);
        const audioURL = URL.createObjectURL(audioBlob);
        setAudioURL(audioURL);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error in starting recording:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const sendAudio = async () => {
    setLoading(true);
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");

    try {
      const response = await fetch(`http://127.0.0.1:8000/transcribe/?meeting_id=${id}`, {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      mutate(`/api/note/${id}`);
      setTranscription(responseData.transcription);
      setLoading(false);
    } catch (error) {
      console.error("Error in sending audio:", error);
    }
  };

  // const createBackgroundJob = async () => {
  //   setLoading(true);
  //   if (!audioBlob) return;

  //   const formData = new FormData();
  //   formData.append("audio", audioBlob, "audio.wav");

  //   try {
  //     const response = await fetch(`http://127.0.0.1:8000/backend_transcribe_job/?meeting_id=${id}`, {
  //       method: "POST",
  //       body: formData,
  //     });
  //     const responseData = await response.json();
  //     setTranscription(responseData.message);
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error in sending audio:", error);
  //   }
  // };


  return (

    <Layout>
      <div className="px-4 md:px-20 lg:px-40 mt-6 mb-16">
        {error ? (
          <div className="text-gray-600">An error occurred.</div>
        ) : !meeting ? (
          <div className="text-gray-600">読み込んでいます...</div>
        ) : (<>
          <PageTitleSection
            title={meeting.title}
            description="会議を録音、議事録を自動作成します。"
          />

          <Section className="mb-8">
            <div className="mb-4">
              <Heading type="sectionTitle">会議の主催者</Heading>
            </div>
            {meeting.crew?.name && <Base padding={1.5}>{meeting.crew.name}</Base>}
          </Section>
          <Section className="mb-8">
            <div className="mb-4">
              <Heading type="sectionTitle">会議の参加者（近日公開、ダミーデータ） </Heading>
            </div>
            <Base padding={1.5} >
              滑饅頭 蟹尾 , 毒卍刀 長命</Base>
          </Section>
          <Section className="mb-8">
            <div className="mb-4">
              <Heading type="sectionTitle">会議音声の録音・アップロード</Heading>
            </div>
            <Base padding={1.5} >
              <div className="mb-4">
                <Heading type="subBlockTitle">録音</Heading>
              </div>
              {recording ?
                <Button className="ml-2 mb-4" onClick={stopRecording}>
                  <FaStopIcon alt="録音停止" text="録音停止" />
                </Button> :
                <Button className="ml-2 mb-4" onClick={startRecording}>
                  <FaPlayIcon alt="録音開始" text="録音開始" />
                </Button>
              }
              <div className="mb-4">
                {audioURL && <audio src={audioURL} controls />}
              </div>

              <div className="mb-4">
                <Heading type="subBlockTitle">録音ファイルのアップロード</Heading>
              </div>
              <Button className="ml-2" disabled >
                アップロード（近日公開）
              </Button>
            </Base>
          </Section>
          <Section>
            <div className="mb-4">
              <Heading type="sectionTitle">議事録の作成・閲覧</Heading>
            </div>
            <Note loading={loading} transcription={transcription} sendAudio={sendAudio} />
          </Section>
        </>
        )}
      </div>
    </Layout>
  );
};

export default Meeting;