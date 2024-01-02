import { NextFunction, Router, static as expressStatic } from "express";
import userRouter from './src/routes/userRouter';
import adminRouter from "./src/routes/adminRouter";
import path from "path";
import user from "./src/models/user";
import userTokenValidation from "./src/middlewares/validation/userTokenValidation";
import adminTokenValidation from "./src/middlewares/validation/adminTokenValidation";


const router = Router();

//user
router.use('/user', (req, _, next: NextFunction) => {
    console.log("new request: user"+ req.url);
    next();
}, userRouter);

router.use('/media', userTokenValidation, expressStatic(path.join(__dirname, './src/uploads')));

//admin
router.use('/admin', (req, _, next: NextFunction) => {
    console.log("new request: admin"+req.url);
    next();
}, adminRouter);

router.use('/media/verification', adminTokenValidation, expressStatic(path.join(__dirname, './src/uploads/verifications')));
router.use('/media/reports', adminTokenValidation, expressStatic(path.join(__dirname, './src/uploads/reports')));

//test only
router.get('/clear-matches', async (_, res) => {await user.updateMany({}, {$unset: {match: null}}); res.send('did')});

export default router;