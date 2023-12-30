import { Request, Response } from "express";
import managePassion from "../../../services/user/update/managePassion";

export default async (req: Request, res: Response) => {
  const userId = req.userId;
  const data = req.body.data;
  try {
    const response = await managePassion(data, userId);
    if (response) {
      return res.status(200).json(response);
    } else throw new Error("Unkown error");
  } catch (error) {
    console.error("Error at controller/user/updatePassion\n" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};
