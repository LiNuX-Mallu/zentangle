import { Router } from "express";
import adminLogin from "../controllers/admin/adminLogin";
import tokenValidation from "../middlewares/validation/adminTokenValidation";
import getUsers from "../controllers/admin/user/getUsers";
import banUnbanUser from "../controllers/admin/user/banUnbanUser";
import fetchVerifications from "../controllers/admin/verification/fetchVerifications";
import Updateverification from "../controllers/admin/verification/updateVerification";
import searchUser from "../controllers/admin/user/searchUser";
import unverifyUser from "../controllers/admin/verification/unverifyUser";
import fetchReports from "../controllers/admin/report/fetchReports";
import reportAction from "../controllers/admin/report/reportAction";
import fetchAlerts from "../controllers/admin/alert/fetchAlerts";
import addAlert from "../controllers/admin/alert/addAlert";
import editAlert from "../controllers/admin/alert/editAlert";

const router = Router();

router.post("/login", adminLogin);
router.post("/logout", (req, res) => {
  res.clearCookie("jwt-admin", { httpOnly: true });
  res.status(200).end();
});

router.get("/get-users/:page/:filter", tokenValidation, getUsers);
router.get("/search-users/:prefix/:filter", tokenValidation, searchUser);
router.post("/ban-unban-user", tokenValidation, banUnbanUser);
router.post("/unverify-user", tokenValidation, unverifyUser);

router.get("/get-verifications/:page", tokenValidation, fetchVerifications);
router.post("/reject-verification", tokenValidation, Updateverification);

router.get("/get-reports/:page/:filter", tokenValidation, fetchReports);
router.post("/report-action", tokenValidation, reportAction);

router.get("/get-alerts/:page/:active", tokenValidation, fetchAlerts);
router.post("/add-alert", tokenValidation, addAlert);
router.put("/edit-alert", tokenValidation, editAlert);

export default router;
