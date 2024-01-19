-- CreateTable
CREATE TABLE "background_job" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "crew_id" TEXT NOT NULL,

    CONSTRAINT "background_job_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "background_job" ADD CONSTRAINT "background_job_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "crew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
