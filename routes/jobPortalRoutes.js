import express from 'express';
import { createJob, deleteJob, getAllJobs, updateJob } from '../controllers/jobPortalController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.route("/createjob").post(isAuthenticated, createJob);
router.route("/getalljobs").get(getAllJobs);
router.route("/updatejob/:id").put(isAuthenticated, updateJob);
router.route("/deletejob/:id").delete(isAuthenticated, deleteJob)

export default router;