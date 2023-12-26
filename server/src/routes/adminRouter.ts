import { Router } from "express";
import adminLogin from "../controllers/admin/adminLogin";
import tokenValidation from "../middlewares/validation/adminTokenValidation";
import getUsers from "../controllers/admin/getUsers";
import banUnbanUser from "../controllers/admin/banUnbanUser";
import fetchVerifications from "../controllers/admin/fetchVerifications";
import Updateverification from "../controllers/admin/updateVerification";
import searchUser from "../controllers/admin/searchUser";
import unverifyUser from "../controllers/admin/unverifyUser";
import fetchReports from "../controllers/admin/fetchReports";
import reportAction from "../controllers/admin/reportAction";
import fetchAlerts from "../controllers/admin/fetchAlerts";
import addAlert from "../controllers/admin/addAlert";
import editAlert from "../controllers/admin/editAlert";

const router = Router();

router.post('/login', adminLogin);
router.post('/logout', (req, res) => {res.clearCookie('jwt-admin', {httpOnly: true}); res.status(200).end()});

router.get('/get-users/:page/:filter', tokenValidation, getUsers);
router.get('/search-users/:prefix/:filter', tokenValidation, searchUser);
router.post('/ban-unban-user', tokenValidation, banUnbanUser);
router.post('/unverify-user', tokenValidation, unverifyUser);

router.get('/get-verifications/:page', tokenValidation, fetchVerifications);
router.post('/reject-verification', tokenValidation, Updateverification);

router.get('/get-reports/:page/:filter', tokenValidation, fetchReports);
router.post('/report-action', tokenValidation, reportAction);

router.get('/get-alerts/:page/:active', tokenValidation, fetchAlerts);
router.post('/add-alert', tokenValidation, addAlert);
router.put('/edit-alert', tokenValidation, editAlert);

export default router;