-- CreateTable
CREATE TABLE "crew" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "department" TEXT NOT NULL,
    "emp_type" TEXT NOT NULL,
    "job_type" TEXT NOT NULL,

    CONSTRAINT "crew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingCrew" (
    "crewId" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,

    CONSTRAINT "MeetingCrew_pkey" PRIMARY KEY ("crewId","meetingId")
);

-- CreateTable
CREATE TABLE "_MeetingCrew" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MeetingCrew_AB_unique" ON "_MeetingCrew"("A", "B");

-- CreateIndex
CREATE INDEX "_MeetingCrew_B_index" ON "_MeetingCrew"("B");

-- AddForeignKey
ALTER TABLE "MeetingCrew" ADD CONSTRAINT "MeetingCrew_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "crew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingCrew" ADD CONSTRAINT "MeetingCrew_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "meeting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetingCrew" ADD CONSTRAINT "_MeetingCrew_A_fkey" FOREIGN KEY ("A") REFERENCES "crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MeetingCrew" ADD CONSTRAINT "_MeetingCrew_B_fkey" FOREIGN KEY ("B") REFERENCES "meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
