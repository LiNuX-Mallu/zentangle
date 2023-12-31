import { Request, Response } from "express";
import manageDeleteMedia from "../../../services/user/media/manageDeleteMedia";

export default async (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    const userId = req.userId;
    const updated = await manageDeleteMedia(filename, userId);
    if (updated) {
      res.status(200).json(updated);
    } else throw new Error("Unknown error");
  } catch (error) {
    res.status(500).json({ message: "Internal servern error" });
    console.error("Error ar controller/user/removeMedia\n" + error);
  }
};
