import { Request, Response } from "express";
import manageBan from "../../services/admin/manageBan";

export default async (req: Request, res: Response) => {
    const username = req.body.username;
    try {
        const banned = await manageBan(username);
        if (banned) {
            return res.status(200).json(banned);
        } else {
            throw new Error("Unknown error\n");
        }
    } catch(error) {
        console.error("Error at controller/admin/banUser\n"+error);
        res.status(500).json(error);
    }
}