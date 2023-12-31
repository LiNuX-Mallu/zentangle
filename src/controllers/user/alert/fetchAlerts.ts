import { Request, Response } from "express";
import alerts from "../../../services/user/alert/alerts";

export default async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const alert = await alerts(userId);

    if (alert) {
      res.status(200).json(alert);
    } else {
      res.status(204).end();
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error at controller/user/fetchAlerts\n" + error);
  }
};
