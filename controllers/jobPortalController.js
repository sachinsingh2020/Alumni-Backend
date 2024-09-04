import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { JobPortal } from "../models/jobPortalModel.js";
import ApiFeatures from "../utils/apiFeatures.js";


export const createJob = catchAsyncError(async (req, res, next) => {
    const user = req.user;

    if (user.role !== "alumni") {
        return next(new ErrorHandler("Only alumni can create job", 400));
    }

    const { jobTitle, companyName, jobLocation, skillsRequired, numberOfOpenings, perks, aboutCompany, jobType, expectedPackage } = req.body;

    console.log({ jobTitle, companyName, jobLocation, skillsRequired, numberOfOpenings, perks, aboutCompany, jobType, expectedPackage });

    if (!jobTitle || !companyName || !jobLocation || !numberOfOpenings || !aboutCompany || !jobType) {
        return next(new ErrorHandler("Please fill all the fields", 400));
    }

    const job = await JobPortal.create({
        jobTitle,
        companyName,
        jobLocation,
        skillsRequired,
        numberOfOpenings,
        perks,
        aboutCompany,
        jobType,
        expectedPackage,
        createdBy: req.user._id,
    });

    res.status(201).json({
        success: true,
        message: "Job created successfully",
        data: job,
    });
});

export const getAllJobs = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 10;
    const jobsCount = await JobPortal.countDocuments();
    const apiFeatures = new ApiFeatures(JobPortal.find(), req.query).search().filter();
    const allJobs = await apiFeatures.query;
    const reversedJobs = allJobs.reverse();
    let filteredJobs = reversedJobs.length;
    let filteredJobsCount = reversedJobs.length;
    // console.log({ reversedJobs });

    // Pagination 
    const page = Number(req.query.page) || 1;
    const startIndex = (page - 1) * resultPerPage;

    apiFeatures.query = apiFeatures.query.limit(resultPerPage).skip(startIndex);

    res.status(200).json({
        success: true,
        reversedJobs,
        resultPerPage,
        filteredJobs,
        filteredJobsCount,
    });
});

export const getJobById = catchAsyncError(async (req, res, next) => {
    const job = await JobPortal.findById(req.params.id);

    if (!job) {
        return next(new ErrorHandler("Job not found", 404));
    }

    res.status(200).json({
        success: true,
        job,
    });
});

export const updateJob = catchAsyncError(async (req, res, next) => {
    let job = await JobPortal.findById(req.params.id);
    // console.log({ job });

    if (!job) {
        return next(new ErrorHandler("Job not found", 404));
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("You are not authorized to update this job", 401));
    }

    job = await JobPortal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Job updated successfully",
        data: job,
    });
});

export const deleteJob = catchAsyncError(async (req, res, next) => {
    const job = await JobPortal.findById(req.params.id);

    if (!job) {
        return next(new ErrorHandler("Job not found", 404));
    }
    // console.log({ job });

    if (job.createdBy.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("You are not authorized to delete this job", 401));
    }

    await JobPortal.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Job deleted successfully",
    });
});


