import express from 'express';
import { alumniRegister, deleteAlumni, getAlumni } from '../controllers/alumniController.js';
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/alumniregister").post(isAuthenticated, alumniRegister);

router.route("/alumni").get(getAlumni);

router.route("/deletealumni/:id").delete(deleteAlumni);

export default router;