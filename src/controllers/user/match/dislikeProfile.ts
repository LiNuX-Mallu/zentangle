import { Request, Response } from "express";
import manageDislike from "../../../services/user/match/manageDislike";

export default async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const profileId = req.body.profileId;
    const disliked = await manageDislike(userId, profileId);
    if (disliked) {
      res.status(200).json({ message: "Profile disliked" });
    } else throw new Error("Unknown error");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error at controller/user/dislikeProfile\n" + error);
  }
};
