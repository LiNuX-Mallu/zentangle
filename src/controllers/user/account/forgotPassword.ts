import { Request, Response } from "express";
import resetPassword from "../../../services/user/account/resetPassword";

export default async (req: Request, res: Response) => {
    try {
        const username = req.body.username;
        const resetted = await resetPassword(username);
        if (resetted?.error === null) {
            res.status(200).json({message: "Temporary password send to registered email address"});
        } else {
            res.status(400).json({message: resetted?.error});
        }
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
        console.error("Error at controller/user/account/forgotPassword\n"+error);
    }
}