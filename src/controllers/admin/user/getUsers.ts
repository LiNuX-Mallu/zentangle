import { Request, Response } from "express";
import findUsers from "../../../services/admin/user/findUsers";

export default async (req: Request, res: Response) => {
  try {
    const currentPage = req.params.page ?? undefined;
    const filter = req.params.filter;
    const users = await findUsers(+currentPage, filter);
    if (users) {
      res.status(200).json(users);
    } else {
      throw new Error("Unknown error");
    }
  } catch (error) {
    console.error("Error at controller/admin/getUsers\n" + error);
    res.status(500).json(error);
  }
};
