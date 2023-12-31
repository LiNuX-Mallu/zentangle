import { Request, Response } from "express";
import { MulterFile } from "../../../interfaces/MulterFile";
import manageReport from "../../../services/user/report/manageReport";
import user from "../../../models/user";

declare module "express-serve-static-core" {
  interface Request {
    files: MulterFile[];
  }
}

export default async (req: Request, res: Response) => {
  try {
    const { against, reason } = req.body;
    const userId = req.userId;
    const images = req.files.map((file) => file.filename);
    const reported = await manageReport(userId, against, reason, images);
    if (reported) res.status(200).end();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error at controller/user/reportUser\n" + error);
  }
};
