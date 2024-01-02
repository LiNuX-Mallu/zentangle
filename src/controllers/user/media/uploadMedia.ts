import { Request, Response } from "express";
import manageMedia from "../../../services/user/media/manageMedia";
import { MulterFile } from "../../../interfaces/MulterFile";

declare module "express-serve-static-core" {
  interface Request {
    file: MulterFile;
  }
}

export default async (req: Request, res: Response) => {
  const file = req.file.location;
  console.log(file);
  const userId = req.userId;
  try {
    const data = await manageMedia(file, userId);
    if (data) {
      return res.status(200).json(data);
    } else {
      throw new Error("Unknown error\n");
    }
  } catch (error) {
    console.error("Error at controller/user/uploadMedia\n" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};
