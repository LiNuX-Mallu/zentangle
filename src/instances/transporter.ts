import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
let { EMAIL, EMAIL_PASSWORD } = process.env;

export default nodemailer.createTransport({
  host: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});