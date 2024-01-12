import { NextFunction, Router } from "express";
import userRouter from './src/routes/userRouter';
import adminRouter from "./src/routes/adminRouter";
import user from "./src/models/user";
import adminTokenValidation from "./src/middlewares/validation/adminTokenValidation";

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
router.get('/admin/clear', adminTokenValidation, async (_, res) => {
    res.send(await user.updateMany({}, {
        $unset: {match: null},
        $set: {chatHistory: [],
            reports: [], 
            blocked: {users: [], contacts: []},
            premium: {likes: [], superLikes: []},
        },
    }));
});

export default router;