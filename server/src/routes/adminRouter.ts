import { Router } from "express";
import adminLogin from "../controllers/admin/adminLogin";
import tokenValidation from "../middlewares/validation/adminTokenValidation";
import getUsers from "../controllers/admin/getUsers";
import banUnbanUser from "../controllers/admin/banUnbanUser";
const router = Router();

router.post('/login', adminLogin);
router.post('/logout', (req, res) => {res.clearCookie('jwt-admin', {httpOnly: true}); res.status(200).end()});
router.get('/get-users/:page', tokenValidation, getUsers);
router.post('/ban-unban-user', tokenValidation, banUnbanUser);

export default router;