import { NextFunction, Router, static as expressStatic } from "express";
import userRouter from './src/routes/userRouter';
import adminRouter from "./src/routes/adminRouter";
import path from "path";

const router = Router();

router.use('/user', (req, _, next: NextFunction) => {
    console.log("new request: user"+ req.url);
     next();
    }, userRouter);

router.use('/admin', (req, _, next: NextFunction) => {
    console.log("new request: admin"+req.url);
    next();
}, adminRouter);

router.use('/media', expressStatic(path.join(__dirname, './src/uploads')));

export default router;