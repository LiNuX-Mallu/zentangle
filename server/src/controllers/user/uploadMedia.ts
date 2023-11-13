import { Request, Response } from "express";
import manageMedia from "../../services/user/manageMedia";

interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
}

declare module 'express-serve-static-core' {
    interface Request {
        file: MulterFile;
    }
}

export default async (req: Request, res: Response) => {
    const file = req.file.filename;
    const userId = req.userId;
    try {
        const data = await manageMedia(file, userId);
        if (data) {
            return res.status(200).json(data);
        } else {
            throw new Error("Unknown error\n");
        }
    } catch(error) {
        console.error('Error at controller/user/uploadMedia\n'+error);
        res.status(500).json({message: "Internal server error"});
    }
}