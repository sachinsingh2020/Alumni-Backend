import express from 'express';
import { alumniLogin, alumniLogout, alumniRegister, deleteAlumni, getAlumni, getAlumniDetails, loadAlumniDetails } from '../controllers/alumniController.js';
import { isAlumniAuthenticated } from '../middlewares/alumniAuth.js';
import singleUpload from '../middlewares/multer.js';

const router = express.Router();

router.route("/alumniregister").post(singleUpload, alumniRegister);

router.route("/alumnilogin").post(alumniLogin);

router.route("/alumnilogout").get(isAlumniAuthenticated, alumniLogout);

router.route("/loadalumnidetails").get(isAlumniAuthenticated, loadAlumniDetails);

router.route("/alumni").get(getAlumni);

router.route("/deletealumni/:id").delete(deleteAlumni);

router.route("/getalumnidetail/:id").get(getAlumniDetails);


export default router;