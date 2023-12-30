import { Request, Response } from "express";
import getProfile from "../../../services/user/profiles/getProfile";

export default async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    const userId = req.userId;
    const profile = await getProfile(userId, username);
    if (profile) {
      res.status(200).json(profile);
    } else throw new Error("Unknown error");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error at controller/user/fetchProfile\n" + error);
  }
};
