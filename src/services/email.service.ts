import nodemailer from "nodemailer";
import { logger } from "../utils/logger.js";

export const sendPasswordResetEmail = async (
 email: string,
 resetUrl: string,
): Promise<void> => {
 const testAccount = await nodemailer.createTestAccount();

 const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
   user: testAccount.user,
   pass: testAccount.pass,
  },
 });

 const info = await transporter.sendMail({
  from: `"School Profile" <${testAccount.user}>`,
  to: email,
  subject: "Reset Password User",
  text: `Gunakan link berikut untuk mengatur ulang password: ${resetUrl}`,
 });

 const previewUrl = nodemailer.getTestMessageUrl(info);

 logger.info(
  {
   event: "PASSWORD_RESET_EMAIL_SENT",
   previewUrl,
  },
  "Preview email berhasil dibuat",
 );
};
