/*
  Warnings:

  - The values [PRINCIPAL] on the enum `StaffType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StaffType_new" AS ENUM ('TEACHER', 'ADMINISTRATIVE');
ALTER TABLE "Staff" ALTER COLUMN "type" TYPE "StaffType_new" USING ("type"::text::"StaffType_new");
ALTER TYPE "StaffType" RENAME TO "StaffType_old";
ALTER TYPE "StaffType_new" RENAME TO "StaffType";
DROP TYPE "public"."StaffType_old";
COMMIT;

-- CreateTable
CREATE TABLE "PrincipalHistory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrincipalHistory_pkey" PRIMARY KEY ("id")
);
