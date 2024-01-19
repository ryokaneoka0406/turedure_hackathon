import ReactWordcloud from "react-wordcloud";
import React, { useState, useEffect } from 'react';
import useSWR from "swr";

type WordFrequency = {
    id: string;
    created_at: string;
    updated_at: string;
    word: string;
    frequency: number;
    crew_id: string;
};

type WordCloudData = {
    text: string;
    value: number;
};

const Wordcloud = () => {
    const fetcher = (url: string) => fetch(url).then((r) => r.json());
    const { data: wordFrequency, error } = useSWR("/api/wordFrequency?id=1", fetcher);
    const [wordCloudData, setWordCloudData] = useState<WordCloudData[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        // コンポーネントがマウントされたら、クライアントサイドであると設定
        setIsClient(true);
    }, []);

    useEffect(() => {
        // wordFrequencyデータが取得できたら加工する
        if (wordFrequency) {
            const processedData = wordFrequency.map((wordFreq: WordFrequency) => ({
                text: wordFreq.word,
                value: wordFreq.frequency
            }));
            setWordCloudData(processedData);
        }
    }, [wordFrequency]);

    if (error) return <div>データの取得に失敗しました。</div>

    return (
        <>
            {isClient && <ReactWordcloud words={wordCloudData} />}
        </>)
}

export default Wordcloud;
