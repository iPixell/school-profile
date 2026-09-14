ALTER TABLE "Admin" RENAME TO "User";

ALTER TABLE "User"
RENAME CONSTRAINT "Admin_pkey" TO "User_pkey";

ALTER INDEX "Admin_email_key"
RENAME TO "User_email_key";

ALTER TABLE "PasswordResetToken"
RENAME COLUMN "adminId" TO "userId";

ALTER TABLE "PasswordResetToken"
RENAME CONSTRAINT "PasswordResetToken_adminId_fkey"
TO "PasswordResetToken_userId_fkey";
