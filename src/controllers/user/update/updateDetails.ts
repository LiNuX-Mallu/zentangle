import { Request, Response } from "express";
import updateDetails from "../../../services/user/update/updateDetails";

export default async (req: Request, res: Response) => {
  const userId = req.userId;
  const data = req.body.data;
  try {
    const response = await updateDetails(data, userId);
    if (response) {
      return res.status(200).json(response);
    } else throw new Error("Unkown error");
  } catch (error) {
    console.error("Error at controller/user/updateDetails\n" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};
