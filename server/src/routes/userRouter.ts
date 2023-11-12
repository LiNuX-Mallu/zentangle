import { Router } from "express";
import tokenValidation from "../middlewares/validation/tokenValidation";
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

const router = Router();

router.get('/check-login', tokenValidation, (req, res) => res.status(200));
router.post('/register', registerValidation, register);
router.post('/login', login);
router.get('/get-details', tokenValidation, getUserDetails);
router.put('/update-passions', tokenValidation, updatePassion);
router.put('/update-languages', tokenValidation, updateLanguages);
router.put('/update-basics', tokenValidation, updateBasics);
router.put('/update-lifestyle', tokenValidation, updateLifestyle);
router.put('/update-details', tokenValidation, updateDetails);
router.put('/update-lookingfor', tokenValidation, updateLookingFor);
router.put('/update-opento', tokenValidation, updateOpenTo);

export default router;