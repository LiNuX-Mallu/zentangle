import Report from "../../../models/report";
import User from "../../../models/user";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { resolve } from "path";

dotenv.config();
let { EMAIL, EMAIL_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

export default async (reportId: string) => {
  try {
    const report = await Report.findById(reportId);
    if (!report) throw new Error("Cannot find report");

    const bannedUser = await User.findOneAndUpdate(
      { username: report.complainee },
      {
        $set: { banned: true },
      },
      { new: true }
    );
    if (!bannedUser) throw new Error("Cannot ban user");

    report.status = "closed";
    await report.save();

    const mailOption = {
      from: EMAIL,
      to: bannedUser.email?.email,
      subject: "Account Ban",
      text: `Dear ${bannedUser.firstname} ${bannedUser.lastname},\n\nYour account has been banned for violating our community guidelines.\nIf you believe this is a mistake, you can appeal or contact us via zentangleapp@gmail.com\n\nThank you,\nZentangle Support Team`,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOption, (error, _) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  } catch (error) {
    throw new Error("Error at service/admin/manageReportAction\n" + error);
  }
};
