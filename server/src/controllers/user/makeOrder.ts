import { Request, Response } from "express";
import manageOrder from "../../services/user/manageOrder";

export default async (req: Request, res: Response) => {
    try {
        const order = await manageOrder();
        if (order) {
            res.status(200).json(order);
        } else {
            throw new Error("Cannot make order");
        }
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
        console.error("Error at controller/user/makeOrder\n"+error);
    }
}