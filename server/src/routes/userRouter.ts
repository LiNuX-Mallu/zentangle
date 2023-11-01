import { Router } from "express";
import tokenValidation from "../middlewares/validation/tokenValidation";
import register from "../controllers/user/register";
import registerValidation from "../middlewares/validation/registerValidation";
import login from "../controllers/user/login";

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', login);
router.post('/token', tokenValidation)

export default router;