import { Request, Response } from "express";
import manageUnmatch from "../../services/user/manageUnmatch";

export default async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const username = req.body.username;
        
        const blocked = await manageUnmatch(userId, username);
        if (blocked) {
            res.status(200).json({message: "Unmatched user"});
        } else throw new Error("Unknown error");
    } catch(error) {
        console.error("Error at controller/user/unmatchProfile\n"+error);
        res.status(500).json({message: "Internal server error"});
    }
}