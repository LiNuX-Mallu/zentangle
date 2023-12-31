import { Request, Response } from "express";
import manageLifestyle from "../../../services/user/update/manageLifestyle";

export default async (req: Request, res: Response) => {
  const userId = req.userId;
  const data = req.body.data;
  try {
    const response = await manageLifestyle(data, userId);
    if (response) {
      return res.status(200).json(response);
    } else throw new Error("Unkown error");
  } catch (error) {
    console.error("Error at controller/user/updateLanguage\n" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};
