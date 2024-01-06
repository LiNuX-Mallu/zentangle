import { Request, Response } from "express";
import scoreProfiles from "../../../services/user/profiles/scoreProfiles";

export default async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const explore = req.params.explore;
    const profiles = await scoreProfiles(userId, explore);
    if (profiles) {
      res.status(200).json(profiles);
    } else throw new Error("Unknown error\n");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error at controller/user/getProfiles\n" + error);
  }
};
