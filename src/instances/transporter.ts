import nodemailer from "nodemailer";
let { EMAIL, EMAIL_PASSWORD } = process.env;

export default nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});