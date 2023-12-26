import { Request, Response } from "express";
import updateAlert from "../../services/admin/updateAlert";

export default async (req: Request, res: Response) => {
    try {
        const {alertId, data, where} = req.body;
        const edited = await updateAlert(alertId, where, data);

        if (edited) {
            res.status(200).json({message: "Alert edited successfully"});
        }
    } catch (error) {
        res.status(500).json({message:"Internal server error"});
        console.error("Errot at controller/admin/editAlert\n"+error);
    }
}