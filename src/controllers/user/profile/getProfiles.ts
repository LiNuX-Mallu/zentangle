import { Request, Response } from "express";
import scoreProfiles from "../../../services/user/profiles/scoreProfiles";

export default async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const explore = req.params.explore;
    const response = await scoreProfiles(userId, explore);
    if (response) {
      if (response === 402) return res.status(402).end();
      else res.status(200).json(response);
    } else throw new Error("Unknown error\n");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error at controller/user/getProfiles\n" + error);
  }
};
