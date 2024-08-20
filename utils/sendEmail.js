import { createTransport } from "nodemailer";

export const sendEmail = async (to, subject, text) => {
  const transporter = createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    port: 465,
    host: 'smtp.gmail.com',
  })

  // console.log({ transporter });

  await transporter.sendMail({
    from: process.env.SMTP_MAIL,
    to,
    subject,
    text,
  });
}