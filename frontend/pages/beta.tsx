import { Base, Button, Heading, Section, FormControl, Textarea } from "smarthr-ui";
import PageTitleSection from "./components/PageTitleSection"
import Layout from "./components/Layout"
import React, { useState, useEffect } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
const Beta = () => {
    const [transcription, setTranscription] = useState<string>("");
    const [recording, setRecording] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        async function convertMarkdownToHtml() {
            if (recording) {
                const rawMarkup = await marked(recording);
                setRecording(DOMPurify.sanitize(rawMarkup));
            }
        }

        convertMarkdownToHtml();
    }, [recording]);

    const refineTranscription = async () => {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/refine/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                transcription: transcription, // 現在は主催した会議、自分の会議のみ対応。いずれ参加した会議も対象に。
            }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        setTranscription("");
        setRecording(responseData.recording);
        setLoading(false);
    }
    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTranscription(event.target.value);
    };

    return (
        <Layout>
            <div className="px-4 md:px-20 lg:px-40 mt-6 mb-16">
                <PageTitleSection
                    title={"ベータ機能:文字起こしの整形"}
                    description="LLMを用いて、文字起こしを議事録に整形します"
                />

                <Section className="mb-8">
                    <div className="mb-4">
                        <Heading type="sectionTitle">議事録の整形</Heading>
                    </div>
                    <Base padding={1.5} >
                        <div className="mb-4">
                            <Heading type="subBlockTitle">文字起こしを入力</Heading>
                        </div>
                        <div className="ml-2 mb-4">
                            <Textarea rows={5} width="100%" onChange={handleChange} />
                        </div>

                        {loading ? <p>読み込み中...</p> : <Button className="ml-2" onClick={refineTranscription}>整形する</Button>}
                    </Base>

                </Section>
                <Section className="mb-8">
                    <div className="mb-4">
                        <Heading type="sectionTitle">整形済み議事録</Heading>
                    </div>
                    <Base padding={1.5} >
                        <div
                            dangerouslySetInnerHTML={{ __html: recording }}
                            className="markdown"
                        ></div></Base>

                </Section>
            </div>
        </Layout >
    )
}

export default Beta