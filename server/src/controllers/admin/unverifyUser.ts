import { Request, Response } from "express";
import manageUnverify from "../../services/admin/manageUnverify";

export default async (req: Request, res: Response) => {
    try {
        const userId = req.body.userId;
        const unVerified = await manageUnverify(userId);
        if (unVerified) {
            res.status(200).json({message: "Unverified successfully"});
        }
    } catch (error) {
        res.status(500).json({message: error});
        console.error("Error at controller/admin/unverifyUser\n"+error);
    }
}