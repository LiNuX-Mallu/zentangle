import { Request, Response } from "express";
import scoreProfiles from "../../services/user/scoreProfiles";

export default async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const profiles = await scoreProfiles(userId);
        if (true) {
            res.status(200).json(profiles);
        } else throw new Error('Unknown error\n');
    } catch(error) {
        res.status(500).json({message: "Internal server error"});
        console.error("Error at controller/user/getProfiles\n"+error);
    }
}