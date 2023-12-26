import { Request, Response } from "express";
import CreateAlert from "../../services/admin/CreateAlert";

export default async (req: Request, res: Response) => {
    try {
        const {title, content} = req.body;
        const added = await CreateAlert(title, content);
        if (added) {
            res.status(200).json({messaged: "New alert added"});
        }
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
        console.error("Errot at controller/admin/addAlert\n"+error);
    }
}