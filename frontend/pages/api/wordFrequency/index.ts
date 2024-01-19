import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const handler =  async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query.id as string;

  try {
    const words = await prisma.word_frequency.findMany({
      where: { crew_id: id }
    });
    res.status(200).json(words);
    } catch (error) {
    res.status(500).json({ message: '何か問題が発生しました', error });
    }
}

export default handler;