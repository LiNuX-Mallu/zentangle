import { Request, Response } from "express";
import openChat from "../../../services/user/chat/openChat";

export default async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const username = req.params.username;
    const chat = await openChat(userId, username);
    if (chat) {
      res.status(200).json(chat);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error at controller/user/getChat\n" + error);
  }
};
