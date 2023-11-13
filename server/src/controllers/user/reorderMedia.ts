import { Request, Response } from "express";
import manageReorder from "../../services/user/manageReorder";

export default async (req: Request, res: Response) => {
    const userId = req.userId;
    const medias = req.body.medias;
    try {
        const saved = await manageReorder(medias, userId);
        if (saved) {
            return res.status(200).end();
        } else throw new Error("Unknown error");
    } catch(error) {
        console.error("Error at controller/user/redorderMedia\n" +error);
        res.status(500).json({message: "Internal server error"});
    }
}