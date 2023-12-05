import { Request, Response } from "express";
import getMessages from "../../services/user/getMessages";

export default async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const messages = await getMessages(userId);
        if (messages) {
            res.status(200).json(messages);
        } else throw new Error("Unknown error");
    } catch(error) {
        console.error("Error at controller/user/fetchMessages\n"+error);
        res.status(500).json({message: "Internal server error"});
    }
}