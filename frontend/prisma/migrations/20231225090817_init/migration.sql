/*
  Warnings:

  - You are about to drop the column `organizer` on the `meeting` table. All the data in the column will be lost.
  - Added the required column `organizer_id` to the `meeting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "meeting" DROP COLUMN "organizer",
ADD COLUMN     "organizer_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "meeting" ADD CONSTRAINT "meeting_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "crew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
