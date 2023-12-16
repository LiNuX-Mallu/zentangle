import { Router } from "express";
import tokenValidation from "../middlewares/validation/userTokenValidation";
import register from "../controllers/user/register";
import registerValidation from "../middlewares/validation/registerValidation";
import login from "../controllers/user/login";
import getUserDetails from "../controllers/user/getUserDetails";
import updatePassion from "../controllers/user/updatePassion";
import updateLanguages from "../controllers/user/updateLanguages";
import updateBasics from "../controllers/user/updateBasics";
import updateLifestyle from "../controllers/user/updateLifestyle";
import updateDetails from "../controllers/user/updateDetails";
import updateLookingFor from "../controllers/user/updateLookingFor";
import updateOpenTo from "../controllers/user/updateOpenTo";
import checkBanned from "../middlewares/checkBanned";
import upload from "../middlewares/upload";
import uploadMedia from "../controllers/user/uploadMedia";
import reorderMedia from "../controllers/user/reorderMedia";
import updateSettings from "../controllers/user/updateSettings";
import removeMedia from "../controllers/user/removeMedia";
import getProfiles from "../controllers/user/getProfiles";
import likeProfile from "../controllers/user/likeProfile";
import dislikeProfile from "../controllers/user/dislikeProfile";
import fetchMatches from "../controllers/user/fetchMatches";
import fetchProfile from "../controllers/user/fetchProfile";
import getChat from "../controllers/user/getChat";
import fetchMessages from "../controllers/user/fetchMessages";
import blockUser from "../controllers/user/blockUser";
import fetchBlocked from "../controllers/user/fetchBlocked";
import unblock from "../controllers/user/unblock";

const router = Router();

router.get('/check-login', tokenValidation, checkBanned, (req, res) => res.status(200));
router.post('/register', registerValidation, register);
router.post('/login', login);
router.post('/logout', (req, res) => {res.clearCookie('jwt', {httpOnly: true}); res.status(200).end()});
router.get('/get-details', tokenValidation, checkBanned, getUserDetails);
router.put('/update-passions', tokenValidation, checkBanned, updatePassion);
router.put('/update-languages', tokenValidation, checkBanned, updateLanguages);
router.put('/update-basics', tokenValidation, checkBanned, updateBasics);
router.put('/update-lifestyle', tokenValidation, checkBanned, updateLifestyle);
router.put('/update-details', tokenValidation, checkBanned, updateDetails);
router.put('/update-lookingfor', tokenValidation, checkBanned, updateLookingFor);
router.put('/update-opento', tokenValidation, checkBanned, updateOpenTo);
router.post('/upload-media', upload.single('file'), tokenValidation, checkBanned, uploadMedia);
router.put('/reorder-media', tokenValidation, checkBanned, reorderMedia);
router.put('/update-settings', tokenValidation, checkBanned, updateSettings);
router.delete('/media/:filename', tokenValidation, checkBanned, removeMedia);

router.get('/get-profiles', tokenValidation, checkBanned, getProfiles);
router.post('/like-profile', tokenValidation, checkBanned, likeProfile);
router.post('/dislike-profile', tokenValidation, checkBanned, dislikeProfile);
router.get('/get-profile/:username', tokenValidation, checkBanned, fetchProfile);

router.get('/get-matches', tokenValidation, checkBanned, fetchMatches);
router.get('/get-messages', tokenValidation, checkBanned, fetchMessages);
router.get('/get-blocked/:from', tokenValidation, checkBanned, fetchBlocked)
router.get('/get-chat/:username', tokenValidation, checkBanned, getChat);

router.post('/block-user', tokenValidation, checkBanned, blockUser);
router.post('/unblock', tokenValidation, checkBanned, unblock);

export default router;