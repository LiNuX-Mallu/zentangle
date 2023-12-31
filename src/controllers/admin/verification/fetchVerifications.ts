import { Request, Response, request } from "express";
import getVerifications from "../../../services/admin/verification/getVerifications";

export default async (req: Request, res: Response) => {
  try {
    const currentPage = req.params.page ?? undefined;
    const requests = await getVerifications(+currentPage);
    if (requests) {
      res.status(200).json(requests);
    } else {
      throw new Error("Unknown error");
    }
  } catch (error) {
    console.error("Error at controller/admin/getVerifications\n" + error);
    res.status(500).json(error);
  }
};
