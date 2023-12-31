import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const jwt_secret_key: string | undefined = process.env.JWT_SECRET;

declare module 'express-serve-static-core' {
    interface Request {
        userId: string;
    }
}

export default async (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.cookies.jwt;
    try {
        const decoded = jwt.verify(token, jwt_secret_key!) as {userId: string} | string;
        if (typeof decoded === 'string') {
            throw new Error('Invalid or expired token');
        } else if (typeof decoded === 'object' && 'userId' in decoded) {
            req.userId = decoded.userId;
            next();
        } else {
            throw new Error('Invalid or expired token');
        }
    } catch(error) {
        res.status(401).json({message: "Invalid or expired token"});
        //console.error("Error at middlewares/validation/userTokenValidation\n"+error);
    }
};