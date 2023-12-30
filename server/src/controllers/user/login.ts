import { Request, Response } from "express";
import checkUser from "../../services/user/checkUser";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface Body {
    username: string;
    password: string;
}

const {JWT_SECRET} = process.env;

export default async (req: Request, res: Response) => {
    const {username, password}: Body = req.body;
    try {
        const userExist = await checkUser({username: username.toLowerCase(), password});
        if (userExist) {
            const token = jwt.sign({userId: userExist}, JWT_SECRET!, {expiresIn: '7d'});
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(200).json({message: "Login successfull"});
        } else {
            res.status(400).json({message: "Incorrect credentials"});
        }
    } catch(error) {
        console.error("Error at controller/user/login\n"+error);
        res.status(500).json({message: "Internal server error"});
    }
};