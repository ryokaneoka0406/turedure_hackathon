import { MeetingsArray } from "@/types/Meeting";
import Layout from "./components/Layout"
import MeetingCollection from "./components/MeetingCollection"
import PageTitleSection from "./components/PageTitleSection"
import React from 'react';
import useSWR from "swr";
import { Meeting } from "@/types/Meeting";
import { note, crew } from "@prisma/client";

type meeting = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  organizer_id: string;
  note: note[];
  crew: crew;
};

const Home = () => {
  // 定数
  const meetingTitleWithCurrentDateTime = `${new Date().toISOString().slice(0, 16).replace('T', ' ')}の会議`;
  // 現在のユーザーのつもり。
  const currentOrgCrewId = "1"

  const transformApiResponseToMeetings = (meetings: meeting[]): Meeting[] => {
    if (!Array.isArray(meetings)) {
      console.error('meetings is not an array:', meetings);
      return [];
    }

    return meetings.map(item => ({
      id: item.id,
      title: item.title,
      created_at: item.created_at,
      updated_at: item.updated_at,
      department: item.crew.department,
      organizer: item.crew.name
    }));
  };

  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data: res, error } = useSWR(`api/meeting?id=${currentOrgCrewId}`, fetcher);
  const meetings = res ? transformApiResponseToMeetings(res) : [];

  return <Layout>
    <div className="px-4 md:px-20 lg:px-40 mt-6">
      <PageTitleSection title="会議一覧" description="会議を録音、議事録を自動作成します。" />
      <MeetingCollection orgCrewId={currentOrgCrewId} title={meetingTitleWithCurrentDateTime} data={meetings} />
    </div>
  </Layout>
}

export default Home
