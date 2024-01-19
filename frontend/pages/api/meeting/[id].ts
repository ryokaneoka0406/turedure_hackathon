import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const handler =  async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string;

  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id },
      include: {
        note: true, // 関連するノートを含む
        crew: true, // 関連するクルーの詳細を含む
      },
    });

    if (meeting) {
      res.status(200).json(meeting);
    } else {
      res.status(404).json({ message: 'Meeting not found' });
    }
  } catch (error) {
    res.status(500).json({ message: '何か問題が発生しました', error });
  }

}

export default handler;