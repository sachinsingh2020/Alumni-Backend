import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Alumni } from "../models/alumniModel.js";
import { User } from "../models/userModel.js";
import ApiFeatures from "../utils/apiFeatures.js";
import cloudinary from "cloudinary";
import { JobPortal } from "../models/jobPortalModel.js";

export const alumniRegister = catchAsyncError(async (req, res, next) => {
    const existingUser = req.user;

    const { graduationYear, fieldOfStudy, profession, industry, jobLocation, linkedin = "unknown", github = "unknown", twitter = "unknown", instagram = "unknown", portfolio = "unknown" } = req.body;

    const alreadyExist = await Alumni.findOne({ email: existingUser.email });

    // console.log({ alreadyExist });

    if (alreadyExist) {
        return next(new ErrorHandler("You are already registered as an Alumni", 400));
    }

    const newUser = await Alumni.create({
        user: existingUser._id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        profilePic: existingUser.profilePic,
        role: existingUser.role,
        graduationYear,
        fieldOfStudy,
        profession,
        industry,
        jobLocation,
        socialMedia: {
            linkedin,
            github,
            twitter,
            instagram,
            portfolio,
        },
    });

    res.status(201).json({
        success: true,
        message: "Alumni Registered Successfully",
        data: newUser,
    });

});

export const getAlumni = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 10;
    const alumniCount = await Alumni.countDocuments();
    const apiFeatures = new ApiFeatures(Alumni.find(), req.query).search().filter();
    const allAlumni = await apiFeatures.query;
    const reversedAlumnis = allAlumni.reverse();
    let filteredAlumni = reversedAlumnis.length;

    // Pagination 
    const page = Number(req.query.page) || 1;
    const startIndex = (page - 1) * resultPerPage;
    const endIndex = page * resultPerPage;
    const paginatedAlumni = reversedAlumnis.slice(startIndex, endIndex);

    res.status(200).json({
        success: true,
        alumnis: paginatedAlumni,
        alumniCount,
        resultPerPage,
        filteredAlumni,
    });
});

export const deleteAlumni = catchAsyncError(async (req, res, next) => {
    const alumni = await Alumni.findById(req.params.id);
    // console.log({ alumni });

    if (!alumni) {
        return next(new ErrorHandler("Alumni not found", 404));
    }
    const jobPosted = await JobPortal.find({ createdBy: alumni.user });

    await JobPortal.deleteMany({ createdBy: alumni.user });

    const user = await User.findOne({ email: alumni.email });

    if (!user) {
        await cloudinary.v2.uploader.destroy(alumni.profilePic.public_id);
        await Alumni.findByIdAndDelete(req.params.id);
        return next(new ErrorHandler("User is a Alumni but record not exist in data base deleting completely", 404));
    }

    await cloudinary.v2.uploader.destroy(alumni.profilePic.public_id);

    await cloudinary.v2.uploader.destroy(user.profilePic.public_id);

    await Alumni.findByIdAndDelete(req.params.id);

    await User.findByIdAndDelete(user._id);

    res.status(200).json({
        success: true,
        message: "Alumni Deleted Successfully",
    });
});

export const getAlumniDetails = catchAsyncError(async (req, res, next) => {
    const alumni = await Alumni.findById(req.params.id);

    if (!alumni) {
        return next(new ErrorHandler("Alumni not found", 404));
    }

    res.status(200).json({
        success: true,
        alumni,
    });
});

// sachin 