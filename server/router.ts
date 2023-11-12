import { NextFunction, Router } from "express";
import userRouter from './src/routes/userRouter';

const router = Router();

router.use('/user', (req, res, next: NextFunction) => {
    console.log("New request: "+ req.url);
     next();
    }, userRouter);

export default router;