import { createTransport } from "nodemailer";

export const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "karanagraharee@gmail.com",
    pass: "rvrr fykf qcst euqw",
  },
})