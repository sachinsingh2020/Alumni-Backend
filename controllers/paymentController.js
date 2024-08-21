import { instance } from "../server.js"
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import crypto from 'crypto';
import ErrorHandler from "../utils/errorHandler.js";
import { Payment } from "../models/paymentModel.js";


function hmac_sha256(message, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(message);
    return hmac.digest('hex');
}

export const checkout = catchAsyncError(async (req, res, next) => {
    let item = req.body.amount;
    // console.log({ item });

    if (!item) {
        return next(new ErrorHandler('Please enter the amount', 400));
    }

    const options = {
        amount: Number(req.body.amount * 100),  // amount in the smallest currency unit
        currency: "INR",
        // receipt: "order_rcptid_11"
    };

    const order = await instance.orders.create(options);

    // console.log({ order });

    res.status(200).json({
        success: true,
        order,
    })
});

export const paymentVerification = catchAsyncError(async (req, res, next) => {

    // console.log("verification", req.body);

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const generated_signature = hmac_sha256(razorpay_order_id + "|" + razorpay_payment_id, process.env.RAZORPAY_API_SECRET);

    // console.log({ generated_signature, razorpay_signature });

    if (generated_signature == razorpay_signature) {
        await Payment.create({
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        })

        res.redirect(`${process.env.FRONTEND_URL}/paymentsuccess?reference=${razorpay_payment_id}`);
    } else {
        res.status(200).json({
            success: true,
        })
    }

    // var { validatePaymentVerification, validateWebhookSignature } = require('./dist/utils/razorpay-utils');

    // validatePaymentVerification({ "order_id": razorpay_order_id, "payment_id": razorpay_payment_id }, razorpay_signature, process.env.RAZORPAY_API_SECRET);

    // console.log({ validatePaymentVerification });


});