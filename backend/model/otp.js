import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, 
        expire: 600,
    },
});

export const OtpModel = mongoose.model("Otp", OtpSchema);