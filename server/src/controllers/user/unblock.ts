import { Request, Response } from "express";
import manageUnblock from "../../services/user/manageUnblock";

export default async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const {who, where} = req.body;

        const unblocked = await manageUnblock(userId, who, where);
        if (unblocked) {
            res.status(200).json({message: 'Unblocked successfully'});
        } else throw new Error("Cannot unblock user");
    } catch(error) {
        console.error("Error at controller/user/unblock\n"+error);
        res.status(500).json({message: "Internal server error"});
    }
}