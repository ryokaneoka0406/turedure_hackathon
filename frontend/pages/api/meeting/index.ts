import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "GET":
      try {
        const id = req.query.id as string;
        // id = organizer_id、organizer_idが一致するmeetingをリストで取得
        const meetings = await prisma.meeting.findMany({
          where: { organizer_id: id },
          include: {
            note: true, // 関連するノートを含む
            crew: true, // 関連するクルーの詳細を含む
          },
          orderBy: {
            created_at: 'desc' // 'desc' は降順を意味します（'asc' は昇順）
          }
        });
        // レスポンスとしてミーティングオブジェクトの配列を返す
        res.status(200).json(meetings);
      }
      catch (e) {
        res.status(500).json({ message: "error occrured" });
      }
      break;
    case "POST":
      try {
        const { title, orgCrewId } = req.body;
  
        const newMeeting = await prisma.meeting.create({
          data: {
            title: title,
            organizer_id: orgCrewId
          },
        });

        // レスポンスとして会議オブジェクトを返す
        res.status(200).json(newMeeting); 
    } catch (e) {
        res.status(500).json({ message: "error occrured" });
    }
      break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        break;
  }
}

export default handler;