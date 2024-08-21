import mongoose from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter your first name"],
    },
    lastName: {
        type: String,
        required: [true, "Please enter your last name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: validator.isEmail,
    },
    role: {
        type: String,
        required: [true, "Please enter your role"],
    },
    profilePic: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    graduationYear: {
        type: Number,
        required: [true, "Please enter your graduation year"],
    },
    fieldOfStudy: {
        type: String,
        required: [true, "Please enter your field of study"],
    },
    profession: {
        type: String,
        required: [true, "Please enter your profession"],
    },
    industry: {
        type: String,
        required: [true, "Please enter your industry"],
    },
    jobLocation: {
        type: String,
        required: [true, "Please enter your job location"],
    },
    socialMedia: {
        linkedin: {
            type: String,
            default: "unknown",
        },
        twitter: {
            type: String,
            default: "unknown",
        },
        instagram: {
            type: String,
            default: "unknown",
        },
        github: {
            type: String,
            default: "unknown",
        },
        portfolio: {
            type: String,
            default: "unknown",
        },
    },
    donation: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Alumni = mongoose.model("Alumni", schema);