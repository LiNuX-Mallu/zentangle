import { Request, Response } from "express"
import getUser from "../../services/user/getUser";

export default async (req: Request, res: Response) => {
    const userId = req.userId;
    try {
        const userDetails = await getUser(userId);
        if (userDetails) {
            res.status(200).json(userDetails);
        } else {
            throw new Error("Unknown error")
        }
    } catch(error) {
        res.status(500).json({message: "Internal server error"});
        console.log("Error at controller/user/getUserDetails\n"+error);
    }
}