import { Request, Response } from "express";
import manageSettings from "../../services/user/manageSettings";

export default async (req: Request, res: Response) => {
    try {
        const where = req.body.where;
        const what = req.body.what;
        const userId = req.userId;
        const updated = await manageSettings(where, what, userId);
        if (updated) res.status(200).json({message: "Settings updated"});
        else throw new Error("Unknown error");
    } catch(error) {
        res.status(200).json({message: "Internal server error"});
        console.error("Error at controller/user/updateSettings\n"+error);
    }
}