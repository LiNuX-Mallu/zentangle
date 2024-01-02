import { NextFunction, Router, static as expressStatic } from "express";
import userRouter from './src/routes/userRouter';
import adminRouter from "./src/routes/adminRouter";
import user from "./src/models/user";

const router = Router();

//user
router.use('/user', (req, _, next: NextFunction) => {
    console.log("new request: user"+ req.url);
    next();
}, userRouter);

//admin
router.use('/admin', (req, _, next: NextFunction) => {
    console.log("new request: admin"+req.url);
    next();
}, adminRouter);

//test only
router.get('/clear-matches', async (_, res) => {await user.updateMany({}, {$unset: {match: null}}); res.send('did')});

export default router;