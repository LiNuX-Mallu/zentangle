import { Request, Response } from "express";
import manageLookingFor from "../../../services/user/update/manageLookingFor";

export default async (req: Request, res: Response) => {
  const data = req.body.data;
  const userId = req.userId;
  try {
    const response = await manageLookingFor(data, userId);
    if (response) {
      return res.status(200).json(response.profile?.relationship?.lookingFor);
    } else {
      throw new Error("Unknown error\n");
    }
  } catch (error) {
    console.error("Error at controller/user/updateLookingFor" + error);
    res.status(500).json({ message: "Internal server error" });
  }
};
