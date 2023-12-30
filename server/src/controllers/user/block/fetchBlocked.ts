import { Request, Response } from "express";
import getBlockedList from "../../../services/user/block/getBlockedList";

export default async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const from = req.params.from;

    const list = await getBlockedList(userId, from);
    if (list) {
      res.status(200).json(list);
    } else throw new Error("Unknown error");
  } catch (error) {
    console.error("Error at controller/user/fetchBlocked\n" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};
