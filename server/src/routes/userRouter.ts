import { Router } from "express";

import register from "../controllers/user/register";
import registerValidation from "../middlewares/validation/registerValidation";

const router = Router();

router.post('/register', registerValidation, register);

export default router;