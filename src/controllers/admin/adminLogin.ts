import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import checkAdmin from "../../services/admin/checkAdmin";
import user from "../../models/user";
dotenv.config();

interface Body {
    username: string;
    password: string;
}

const {JWT_SECRET, DOMAIN} = process.env;

export default async (req: Request, res: Response) => {
    const {username, password}: Body = req.body;
    try {
        const adminExist = await checkAdmin({username: username.toLowerCase(), password});
        if (adminExist) {
            const token = jwt.sign({adminId: adminExist}, JWT_SECRET!, {expiresIn: '7d'});
            res.cookie('jwt-admin', token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 2 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({message: "Login successfull"});
        } else {
            res.status(400).json({message: "Incorrect credentials"});
        }
    } catch(error) {
        console.error("Error at controller/admin/adminLogin\n"+error);
        res.status(500).json({message: "Internal server error"});
    }
};