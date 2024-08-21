import express from 'express';
import { deleteMyAccount, deleteUser, forgetPassword, getAllUsers, getMe, getUserDetails, login, logout, register, resetPassword, updateUserDetails, updateUserProfilePic } from '../controllers/userController.js';
import singleUpload from '../middlewares/multer.js';
import { authorizeAdmin, isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.route('/register').post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgetpassword").post(forgetPassword);
router.route('/resetpassword/:token').put(resetPassword);
router.route("/getuser/:id").get(getUserDetails);
router.route("/getallusers").get(getAllUsers);
router.route("/getme").get(isAuthenticated, getMe);
router.route("/updateuserdetails").put(isAuthenticated, updateUserDetails);
router.route("/updateuserprofilepic").put(isAuthenticated, singleUpload, updateUserProfilePic);
router.route("/deleteuser/:id").delete(isAuthenticated, authorizeAdmin, deleteUser);
router.route("/deletemyaccount").delete(isAuthenticated, deleteMyAccount);


export default router;