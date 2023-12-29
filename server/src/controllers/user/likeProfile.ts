import { Request, Response } from "express";
import manageLike from "../../services/user/manageLike";

export default async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const profileId = req.body.profileId;
    const isSuper = Boolean(req.body.isSuper);
    const status = await manageLike(userId, profileId, isSuper);

    if (status.error) {
      return res.status(400).json({error: status.error});
    } else {
      res.status(200).json({ matched: status.matched });
    }

  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error at controller/user/likeProfile\n" + error);
  }
};
