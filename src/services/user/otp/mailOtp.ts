import dotenv from "dotenv";
import transporter from "../../../instances/transporter";
import User from "../../../models/user";

dotenv.config();
let { EMAIL } = process.env;

export default async (email: string) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000);

        const expirationTime = new Date();
        expirationTime.setMinutes(expirationTime.getMinutes() + 5);
        
        const mailOption = {
            from: EMAIL,
            to: email,
            subject: "Email Verification",
            text: `Your OTP for verification of email: ${email} is ${otp}.\nDo not share with anyone.`,
        };
    
        return await new Promise((resolve, reject) => {
            transporter.sendMail(mailOption, (error, _) => {
                if (error) {
                    reject(error);
                } else {
                    User.findOneAndUpdate({'email.email': email}, {
                        $set: {otp: {code: otp, expireAt: expirationTime}}
                    }).then(() => resolve(true));
                }
            });
        })
    } catch (error) {
        throw new Error("Error mailing OTP\n"+error);
    }
}