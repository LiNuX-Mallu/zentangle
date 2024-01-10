import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

let { EMAIL, EMAIL_PASSWORD } = process.env;

export default nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: 'zentangleapp@gmail.com',
    pass: 'ckwd lrvb wosk mcjc',
  },
});