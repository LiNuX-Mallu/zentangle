import { Request, Response } from "express";
import manageRequestVerification from "../../services/user/manageRequestVerification";
import user from "../../models/user";

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
        const requested = await manageRequestVerification(userId, file);
        if (requested) {
            return res.status(200).json({message: 'Requested for verification'});
        } else {
            throw new Error("Unknown error\n");
        }
    } catch(error) {
        console.error('Error at controller/user/requestVerification\n'+error);
        res.status(500).json({message: "Internal server error"});
    }
}