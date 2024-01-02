import User from "../../models/user";
import { Request, Response, NextFunction } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (user && user.banned) {
      return res.status(403).json({ message: "Account is banned" });
    }
    next();
  } catch (error) {
    console.log("Error at middleware/checkBan\n" + error);
    res.status(500).json({ message: "Internal server errror" });
  }
};
