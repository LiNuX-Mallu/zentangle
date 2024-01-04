import { Request, Response } from "express";
import addUser from "../../../services/user/account/addUser";

export default async (req: Request, res: Response) => {
  try {
    const registered = await addUser(req.body);
    if (registered) {
      res.status(200).json({ message: "Registered successfully" });
    } else {
      throw new Error("Unknown error");
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Error at controller/user/register\n" + error);
  }
};
