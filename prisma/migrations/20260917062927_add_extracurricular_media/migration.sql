/*
  Warnings:

  - You are about to drop the column `description` on the `Extracurricular` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "Extracurricular" DROP COLUMN "description";

-- CreateTable
CREATE TABLE "ExtracurricularMedia" (
    "id" SERIAL NOT NULL,
    "extracurricularId" INTEGER NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExtracurricularMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExtracurricularMedia" ADD CONSTRAINT "ExtracurricularMedia_extracurricularId_fkey" FOREIGN KEY ("extracurricularId") REFERENCES "Extracurricular"("id") ON DELETE CASCADE ON UPDATE CASCADE;
