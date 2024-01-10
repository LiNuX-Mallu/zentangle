import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();
let { EMAIL, EMAIL_PASSWORD } = process.env;

export default nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});