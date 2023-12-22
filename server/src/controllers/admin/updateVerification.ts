import { Request, Response } from "express";
import manageVerification from "../../services/admin/manageVerification";

export default async (req: Request, res: Response) => {
    try {
        const requestId = req.body.requestId;
        const verify = Boolean(req.body.verify);
        const updated = await manageVerification(requestId, verify);
        if (updated) {
            res.status(200).json({message: "Updated verification"});
        } else throw new Error("Unknown Error");
    } catch(error) {
        res.status(500).json(error);
        console.error("Error at controller/admin/updateVerification\n"+error);
    }
}