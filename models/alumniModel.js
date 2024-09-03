import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

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
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Password must be at least 6 characters"],
        select: false
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
    dateOfBirth: {
        type: String,
        required: [true, "Please enter your date of birth"],
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

    resetPasswordToken: String,
    resetPasswordExpire: String,
});

schema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
})

schema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

schema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

schema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

export const Alumni = mongoose.model("Alumni", schema);