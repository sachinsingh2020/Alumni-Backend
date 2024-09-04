import express from 'express';
import { createJob, deleteJob, getAllJobs, getJobById, updateJob } from '../controllers/jobPortalController.js';
import { isAlumniAuthenticated } from '../middlewares/alumniAuth.js';

const router = express.Router();

router.route("/createjob").post(isAlumniAuthenticated, createJob);
router.route("/getalljobs").get(getAllJobs);
router.route("/updatejob/:id").put(isAlumniAuthenticated, updateJob);
router.route("/deletejob/:id").delete(isAlumniAuthenticated, deleteJob);
router.route("/getjob/:id").get(getJobById);

export default router;