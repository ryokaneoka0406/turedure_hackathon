-- CreateTable
CREATE TABLE "word_frequency" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "word" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,
    "crew_id" TEXT NOT NULL,

    CONSTRAINT "word_frequency_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "word_frequency" ADD CONSTRAINT "word_frequency_crew_id_fkey" FOREIGN KEY ("crew_id") REFERENCES "crew"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
