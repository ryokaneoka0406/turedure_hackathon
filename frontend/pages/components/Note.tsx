import useSWR from "swr";
import { useRouter } from "next/router";

import { Base, Button, Heading } from "smarthr-ui";
import React from 'react';

type props = {
    loading: boolean;
    transcription: string;
    sendAudio: () => void;
};


const Note = (props: props) => {
    const router = useRouter();
    const { id } = router.query;

    const fetcher = (url: string) => fetch(url).then((r) => r.json());
    const { data: note, error } = useSWR(`/api/note/${id}`, fetcher);
    ;

    return (
        <Base padding={1.5}>
            {props.loading ? (
                <p className="mb-4">読み込み中...</p>
            ) : (<Button className="mb-4" onClick={props.sendAudio} >
                議事録の作成
            </Button>)}

            {note &&
                <>
                    <div className="mb-4">
                        <Heading type="subBlockTitle">議事録</Heading>
                    </div>
                    {note?.transcription}
                </>

            }
        </Base >
    );
};

export default Note;