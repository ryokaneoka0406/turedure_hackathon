import { Base, Button, Heading, Section } from "smarthr-ui"
import Layout from "./components/Layout"
import PageTitleSection from "./components/PageTitleSection"
import Wordcloud from "./components/Wordcloud";
import useSWR, { useSWRConfig } from "swr";
import React, { useState } from 'react';



const Analytics = () => {
    const fetcher = (url: string) => fetch(url).then((r) => r.json());
    // 社員番号決めうち
    const { data: backgroundJob, error } = useSWR(`http://localhost:3000/api/backgroundJob/1`, fetcher);
    const { mutate } = useSWRConfig();

    const [isLoading, setIsLoading] = useState(false);



    const requestAnalytics = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("http://127.0.0.1:8000/background_analitics_job/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    organizer_id: "1", // 現在は主催した会議、自分の会議のみ対応。いずれ参加した会議も対象に。
                }),
            });
            mutate("/api/backgroundJob/1");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.error("Error in sending request:", error);
        }
    };
    return (
        <Layout>
            <div className="px-4 md:px-20 lg:px-40 mt-6">
                <Section className="mb-8">
                    <PageTitleSection title="リョウ・ペンギンさんの会議データ" description="会議に関する統計データを表示します" />

                    {
                        isLoading ? (
                            // isLoading が true の場合のコンテンツ
                            <>
                                <Button variant="primary" className="mb-6" disabled>データの分析中です...</Button>
                                <button onClick={() => {
                                    location.reload();
                                }} className="ml-2 linkText underline">ページを更新してください。</button>
                            </>
                        ) : backgroundJob?.status === 1 ? (
                            // backgroundJob.status が 1 の場合のコンテンツ
                            <>
                                <Button variant="primary" className="mb-6" disabled>データの分析中です...</Button>
                                <button onClick={() => {
                                    location.reload();
                                }} className="ml-2 linkText underline">ページを更新してください。</button>
                            </>
                        ) : (
                            // それ以外の場合のコンテンツ
                            <Button variant="primary" onClick={requestAnalytics}>データを分析する</Button>
                        )
                    }
                </Section>
                {backgroundJob?.status === 2 &&
                    <Section className="mb-8">
                        <div className="mb-4">
                            <Heading type="sectionTitle">単語の出現頻度</Heading>
                        </div>
                        <Base padding={1.5}>
                            <Wordcloud />
                        </Base>
                    </Section>
                }
            </div>
        </Layout>
    )
}

export default Analytics