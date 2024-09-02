import express from 'express';
import { alumniRegister, deleteAlumni, getAlumni, getAlumniDetails } from '../controllers/alumniController.js';
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/alumniregister").post(isAuthenticated, alumniRegister);

router.route("/alumni").get(getAlumni);

router.route("/deletealumni/:id").delete(deleteAlumni);

router.route("/getalumnidetail/:id").get(getAlumniDetails);

export default router;