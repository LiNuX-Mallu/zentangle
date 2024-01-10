import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
let { EMAIL, EMAIL_PASSWORD } = process.env;

export default nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: true,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});