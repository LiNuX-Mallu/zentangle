import { Request, Response } from "express";
import getReports from "../../../services/admin/report/getReports";
import getAlerts from "../../../services/admin/alert/getAlerts";

export default async (req: Request, res: Response) => {
  try {
    const currentPage = req.params.page;
    const isActive = req.params.active === "true";
    const alerts = await getAlerts(+currentPage, isActive);
    if (alerts) {
      res.status(200).json(alerts);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error at controller/admin/fetchAlerts\n" + error);
  }
};
