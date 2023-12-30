import { Request, Response } from "express";
import getMatches from "../../../services/user/match/getMatches";

export default async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const matches = await getMatches(userId);
    if (matches) {
      res.status(200).json(matches);
    } else throw new Error("Unknown error");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error at controller/user/fetchMatches\n" + error);
  }
};
