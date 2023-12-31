import { Request, Response } from "express";
import manageBlockUser from "../../../services/user/block/manageBlockUser";

export default async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const username = req.body.username;

    const blocked = await manageBlockUser(userId, username);
    if (blocked) {
      res.status(200).json({ message: "Blocked user" });
    } else throw new Error("Unknown error");
  } catch (error) {
    console.error("Error at controller/user/blockUser\n" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};
