import { Request, Response } from "express";
import manageReportAction from "../../../services/admin/report/manageReportAction";

export default async (req: Request, res: Response) => {
  try {
    const reportId = req.body.reportId;
    const actionDone = await manageReportAction(reportId);
    if (actionDone) {
      res.status(200).json({ message: "Banned complainee and send email" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error at controller/admin/reportAction\n" + error);
  }
};
