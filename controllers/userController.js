import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { User } from "../models/userModel.js";
import cloudinary from "cloudinary";
import ApiFeatures from "../utils/apiFeatures.js";
import { JobPortal } from "../models/jobPortalModel.js";
import { Alumni } from "../models/alumniModel.js";



export const register = catchAsyncError(async (req, res, next) => {
    // console.log("in the register")
    const { firstName, lastName, email, password, role } = req.body;

    // console.log({ firstName, lastName, email, password });

    if (!firstName || !lastName || !email || !password) {
        return next(new ErrorHandler('All fields are required', 400));
    }

    let user = await User.findOne({ email });

    if (user) {
        return next(new ErrorHandler("User already exists", 409));
    }

    const file = req.file;
    // console.log({ file });

    if (!file) {
        return next(new ErrorHandler('Please upload an image file', 400));
    }

    const fileUri = getDataUri(file);
    // console.log({ fileUri });

    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    // console.log({ mycloud });

    user = await User.create({
        firstName,
        lastName,
        email,
        password,
        role,
        profilePic: {
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
        },
    });

    sendToken(res, user, "Registered Successfully", 201);
});

export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Incorrect Email or Password", 401));

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
        return next(new ErrorHandler("Incorrect Email or Password", 401));

    sendToken(res, user, `Welcome back, ${user.firstName}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
    res
        .status(200)
        .cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            // secure: true,
            sameSite: "none",
        })
        .json({
            success: true,
            message: "Logged Out Successfully",
            isAuthenticated: false,
        });
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    // console.log({ email });
    const user = await User.findOne({ email });

    // console.log({ user });

    if (!user) return next(new ErrorHandler("User not found", 400));

    const resetToken = await user.getResetToken();

    // console.log({ resetToken });

    await user.save();

    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

    const message = `Click on the link to reset your password. ${url} If you have not request then please ignore.`;

    // console.log({ message });

    // Send token via email
    await sendEmail(user.email, "Reset Password for Alumni Site", message);

    res.status(200).json({
        success: true,
        message: `Reset Token has been sent to ${user.email}`,
    });
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now(),
        },
    });

    if (!user)
        return next(new ErrorHandler("Token is invalid or has been expired", 401));

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password Changed Successfully",
    });
});

export const getUserDetails = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) return next(new ErrorHandler("User not found", 404));

    res.status(200).json({
        success: true,
        user,
    });
});

export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 10;
    const usersCount = await User.countDocuments();
    const apiFeatures = new ApiFeatures(User.find(), req.query).search().filter();
    const allUsers = await apiFeatures.query;
    const reversedUsers = allUsers.reverse();
    let filteredUsers = reversedUsers.length;

    // Pagination 
    const page = Number(req.query.page) || 1;
    const startIndex = (page - 1) * resultPerPage;

    apiFeatures.query = apiFeatures.query.limit(resultPerPage).skip(startIndex);

    res.status(200).json({
        success: true,
        reversedUsers,
        usersCount,
        resultPerPage,
        filteredUsers,
    });
});

export const updateUserDetails = catchAsyncError(async (req, res, next) => {
    let user = await User.findById(req.user._id);

    console.log({ user });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const newUserDetails = {
        firstName: req.body.firstName || user.firstName,
        lastName: req.body.lastName || user.lastName,
        email: req.body.email || user.email,
        role: user.role,
        profilePic: user.profilePic,
    };

    console.log({ newUserDetails });

    user = await User.findByIdAndUpdate(req.user._id, newUserDetails, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    // console.log({ user });


    res.status(200).json({
        success: true,
        message: "User updated successfully",
        user,
    });
});

export const updateUserProfilePic = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const file = req.file;
    await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    user.profilePic = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
    };

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile Pic updated successfully",
        user,
    });
});

export const getMe = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

export const deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    // console.log({ user });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    const ifAlumni = await Alumni.findOne({ email: user.email });

    if (ifAlumni) {
        await cloudinary.v2.uploader.destroy(ifAlumni.profilePic.public_id);
        await Alumni.findByIdAndDelete(ifAlumni._id);
    }

    // const jobPosted = await JobPortal.find({ createdBy: req.params.id });

    // console.log({ jobPosted });

    await JobPortal.deleteMany({ createdBy: req.params.id });

    await cloudinary.v2.uploader.destroy(user.profilePic.public_id);

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});

export const deleteMyAccount = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const ifAlumni = await Alumni.findOne({ email: user.email });

    if (ifAlumni) {
        await cloudinary.v2.uploader.destroy(ifAlumni.profilePic.public_id);
        await Alumni.findByIdAndDelete(ifAlumni._id);
    }
    // const jobPosted = await JobPortal.find({ createdBy: req.user._id });

    await JobPortal.deleteMany({ createdBy: req.user._id });

    await cloudinary.v2.uploader.destroy(user.profilePic.public_id);

    await User.findByIdAndDelete(req.user._id);

    res.status(200).json({
        success: true,
        message: "Your account has been closed successfully",
    });
});
