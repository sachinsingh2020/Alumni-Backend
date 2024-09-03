import jwt from 'jsonwebtoken';
import ErrorHandler from '../utils/errorHandler.js';
import { catchAsyncError } from './catchAsyncError.js';
import { Alumni } from '../models/alumniModel.js';

export const isAlumniAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler('Login First To Access This Resource', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await Alumni.findById(decoded._id);

    console.log(req.user);
    // console.log('passing from isAuthenticated');
    next();
})



export const authorizeAlumniAdmin = (req, res, next) => {
    if (req.user.role != "admin")
        return next(new ErrorHandler(`${req.user.role} is not allowed to access this resource`, 403));

    next();
};
