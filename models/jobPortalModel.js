import mongoose from "mongoose";

const schema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: [true, "Please enter the job title"],
    },
    companyName: {
        type: String,
        required: [true, "Please enter the company name"],
    },
    jobLocation: {
        type: String,
        required: [true, "Please enter the job location"],
    },
    keyResponsibilities: {
        type: String,
        required: [true, "Please enter the key responsibilities"],
    },
    skillsRequired: [
        {
            type: String,
        },
    ],
    numberOfOpenings: {
        type: Number,
        required: [true, "Please enter the number of openings"],
    },
    perks: [
        {
            type: String,
        },
    ],
    aboutCompany: {
        type: String,
        required: [true, "Please enter about the company"],
    },
    jobType: {
        type: String,
        required: [true, "Please choose the job type"],
    },
    expectedPackage: {
        type: String,
        default: "Not Disclosed",
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const JobPortal = mongoose.model("JobPortal", schema);