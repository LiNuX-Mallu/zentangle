import { Request, Response } from "express";
import getReports from "../../../services/admin/report/getReports";

export default async (req: Request, res: Response) => {
  try {
    const currentPage = req.params.page;
    const filter = req.params.filter;

    const reports = await getReports(+currentPage, filter);
    if (reports) {
      res.status(200).json(reports);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error at controller/admin/fetchReports\n" + error);
  }
};
