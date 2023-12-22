import { Request, Response } from "express";
import manageSearchUser from "../../services/admin/manageSearchUser";

export default async (req: Request, res: Response) => {
    try {
        const prefix = req.params.prefix;
        const filter = req.params.filter;
        const users = await manageSearchUser(prefix, filter);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
        console.error("Error at controller/admin/searchUser\n"+error);
    }
}