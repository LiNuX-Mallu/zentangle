import { Request, Response } from "express";
import validateOtp from "../../../services/user/otp/validateOtp";

export default async (req: Request, res: Response) => {
    try {
        const {otp, email} = req.body;
        const validated = await validateOtp(otp, email);
        if (validated && validated.error === null) {
            res.status(200).json({message: "Email verification successful"});
        } else {
            res.status(400).json({message: validated?.error ?? "Something went wrong"});
        }
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
        console.error("Error at controller/user/verifyOtp\n"+error);
    }
}