import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT);
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;

if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
 throw new Error("SMTP configuration is not complete");
}

const transporter = nodemailer.createTransport({
 host: smtpHost,
 port: smtpPort,
 secure: smtpPort === 465,
 auth: {
  user: smtpUser,
  pass: smtpPassword,
 },
});

export const sendPasswordResetEmail = async (
 email: string,
 resetUrl: string,
): Promise<void> => {
 await transporter.sendMail({
  from: smtpUser,
  to: email,
  subject: "Reset Password Admin",
  text: `Gunakan link berikut untuk mengatur ulang password: ${resetUrl}`,
 });
};
