import { Router } from "express";

//middlewares
import upload from "../middlewares/upload";
import uploadReportImages from "../middlewares/uploadReportImages";
import tokenValidation from "../middlewares/validation/userTokenValidation";
import registerValidation from "../middlewares/validation/registerValidation";
import checkBanned from "../middlewares/checkBanned";

//controllers
import register from "../controllers/user/register";
import login from "../controllers/user/login";
import getUserDetails from "../controllers/user/getUserDetails";
import updatePassion from "../controllers/user/update/updatePassion";
import updateLanguages from "../controllers/user/update/updateLanguages";
import updateBasics from "../controllers/user/update/updateBasics";
import updateLifestyle from "../controllers/user/update/updateLifestyle";
import updateDetails from "../controllers/user/update/updateDetails";
import updateLookingFor from "../controllers/user/update/updateLookingFor";
import updateOpenTo from "../controllers/user/update/updateOpenTo";
import uploadMedia from "../controllers/user/media/uploadMedia";
import reorderMedia from "../controllers/user/media/reorderMedia";
import updateSettings from "../controllers/user/update/updateSettings";
import removeMedia from "../controllers/user/media/removeMedia";
import getProfiles from "../controllers/user/profile/getProfiles";
import likeProfile from "../controllers/user/match/likeProfile";
import dislikeProfile from "../controllers/user/match/dislikeProfile";
import fetchMatches from "../controllers/user/match/fetchMatches";
import fetchProfile from "../controllers/user/profile/fetchProfile";
import getChat from "../controllers/user/chat/getChat";
import fetchMessages from "../controllers/user/chat/fetchMessages";
import blockUser from "../controllers/user/block/blockUser";
import fetchBlocked from "../controllers/user/block/fetchBlocked";
import unblock from "../controllers/user/block/unblock";
import unmatchProfile from "../controllers/user/match/unmatchProfile";
import uploadWebcams from "../middlewares/uploadWebcams";
import requestVerification from "../controllers/user/verification/requestVerification";
import reportUser from "../controllers/user/report/reportUser";
import fetchAlerts from "../controllers/user/alert/fetchAlerts";
import makeOrder from "../controllers/user/premium/makeOrder";
import paymentStatus from "../controllers/user/premium/paymentStatus";

const router = Router();

router.get("/check-login", tokenValidation, checkBanned, (req, res) =>
  res.status(200)
);
router.post("/register", registerValidation, register);
router.post("/login", login);
router.post("/logout", (req, res) => {
  res.clearCookie("jwt", { httpOnly: true });
  res.status(200).end();
});
router.get("/get-details", tokenValidation, checkBanned, getUserDetails);
router.put("/update-passions", tokenValidation, checkBanned, updatePassion);
router.put("/update-languages", tokenValidation, checkBanned, updateLanguages);
router.put("/update-basics", tokenValidation, checkBanned, updateBasics);
router.put("/update-lifestyle", tokenValidation, checkBanned, updateLifestyle);
router.put("/update-details", tokenValidation, checkBanned, updateDetails);
router.put(
  "/update-lookingfor",
  tokenValidation,
  checkBanned,
  updateLookingFor
);
router.put("/update-opento", tokenValidation, checkBanned, updateOpenTo);
router.post(
  "/upload-media",
  upload.single("file"),
  tokenValidation,
  checkBanned,
  uploadMedia
);
router.put("/reorder-media", tokenValidation, checkBanned, reorderMedia);
router.put("/update-settings", tokenValidation, checkBanned, updateSettings);
router.delete("/media/:filename", tokenValidation, checkBanned, removeMedia);

router.post(
  "/request-verification",
  tokenValidation,
  checkBanned,
  uploadWebcams.single("file"),
  requestVerification
);

router.get("/get-profiles", tokenValidation, checkBanned, getProfiles);
router.post("/like-profile", tokenValidation, checkBanned, likeProfile);
router.post("/dislike-profile", tokenValidation, checkBanned, dislikeProfile);
router.get(
  "/get-profile/:username",
  tokenValidation,
  checkBanned,
  fetchProfile
);

router.get("/get-matches", tokenValidation, checkBanned, fetchMatches);
router.get("/get-messages", tokenValidation, checkBanned, fetchMessages);
router.get("/get-blocked/:from", tokenValidation, checkBanned, fetchBlocked);
router.get("/get-chat/:username", tokenValidation, checkBanned, getChat);

router.post("/block-user", tokenValidation, checkBanned, blockUser);
router.post("/unblock", tokenValidation, checkBanned, unblock);
router.post("/unmatch-user", tokenValidation, checkBanned, unmatchProfile);

router.post(
  "/report",
  uploadReportImages.array("images"),
  tokenValidation,
  checkBanned,
  reportUser
);

router.get("/alerts", tokenValidation, checkBanned, fetchAlerts);

router.post("/make-order", tokenValidation, checkBanned, makeOrder);
router.post("/payment-status", tokenValidation, checkBanned, paymentStatus);

export default router;
