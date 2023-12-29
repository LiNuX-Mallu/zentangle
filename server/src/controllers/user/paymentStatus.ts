import { Request, Response } from "express";
import managePayment from "../../services/user/managePayment";

export default async (req: Request, res: Response) => {
    try {
        const orderId = req.body.orderId;
        const userId = req.userId;
        const paid = await managePayment(orderId, userId);
        if (paid) {
            res.status(200).end();
        } else res.status(400);
    } catch (error) {
        res.json(500).json({message: "Internal server error"});
        console.error("Error at controller/user/paymentStatus\n"+error);
    }
}