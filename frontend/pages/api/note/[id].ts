import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const handler =  async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string;

  try {
    const notes = await prisma.note.findMany({
      where: { meeting_id: id },
      include: {
        meeting: true, // 関連するミーティングを含む
      },
      orderBy: {
        created_at: 'desc', // 作成日時で降順に並べ替え
      },
      take: 1 // 最新のレコードのみ取得
    });
    
    const note = notes[0];
    if (note) {
      res.status(200).json(note);
    } else {
      res.status(404).json({ message: 'note not found' });
    }
  } catch (error) {
    res.status(500).json({ message: '何か問題が発生しました', error });
  }


}

export default handler;