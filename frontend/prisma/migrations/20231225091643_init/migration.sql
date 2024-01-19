/*
  Warnings:

  - You are about to drop the `MeetingCrew` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MeetingCrew` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MeetingCrew" DROP CONSTRAINT "MeetingCrew_crewId_fkey";

-- DropForeignKey
ALTER TABLE "MeetingCrew" DROP CONSTRAINT "MeetingCrew_meetingId_fkey";

-- DropForeignKey
ALTER TABLE "_MeetingCrew" DROP CONSTRAINT "_MeetingCrew_A_fkey";

-- DropForeignKey
ALTER TABLE "_MeetingCrew" DROP CONSTRAINT "_MeetingCrew_B_fkey";

-- AlterTable
ALTER TABLE "meeting" ADD COLUMN     "crewId" TEXT;

-- DropTable
DROP TABLE "MeetingCrew";

-- DropTable
DROP TABLE "_MeetingCrew";
