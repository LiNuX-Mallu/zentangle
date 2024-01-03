import { Request, Response } from "express"
import mailOtp from "../../../services/user/otp/mailOtp";

export default async (req: Request, res: Response) => {
    try {
        const email = req.body.email;
        const send = await mailOtp(email);
        if (send) {
            res.status(200).json({message: `OTP send to ${email}`});
        }
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
        console.error("Error at controller/user/resendOtp\n"+error);
    }
}