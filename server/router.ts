import { Router } from "express";
import userRouter from './src/routes/userRouter';

const router = Router();

router.use('/user', userRouter);

export default router;