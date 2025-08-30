const { AppError } = require('@repo/utils');
const { signUpSchema,loginSchema } = require('../validators');
const { RegisterNewUserService, LoginUserService, OtpService, OtpVerificationService, VerifyEmailService } = require('../service');
const { OTP_LENGTH } = require('../constants');

const createNewUser = async (req,res) => {
    if(!req.body){
        throw new AppError("Payload is Empty",400);
    }
    const { error } = signUpSchema.validate(req.body);
    if(error)throw new AppError(error.message,400);
    await RegisterNewUserService(req.body);
    return res.status(200).send("Email Sent.")
}

const verifyEmail = async (req,res) => {
    if(!req.query.token){
        throw new AppError("Bad Request",400);
    }
    await VerifyEmailService(req.query.token);
    return res.status(200).send("Email Verified Successfully.");
}

const loginUser = async (req,res) => {
    if(!req.body){
        throw new AppError("Payload is Empty",400);
    }
    const { error } = loginSchema.validate(req.body);
    if(error)throw new AppError(error.message,400);
    const token = await LoginUserService(req.body);
    res.cookie("otpToken",token,{
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 5,
    })
    return res.status(200).json({
        status: "Success",
        message: "Correct Password!"
    });
}

const generateOtp = async (req,res) => {
    const otpToken = req.cookies.otpToken;
    if(!otpToken) throw new AppError("Bad Request", 400);
    const otp = OtpService(otpToken);
    return res.status(200).json({
        status: "Success",
        otp,
    });
}

const validateOtp = async (req,res) => {
    const otpToken = req.cookies.otpToken;
    if(!req.body){
        throw new AppError("Payload is Empty",400);
    }
    if(!otpToken || req.body.otp.length !== OTP_LENGTH) throw new AppError("Bad Request", 400);
    const { token,refreshToken } = await OtpVerificationService(otpToken,req.body.otp);
    res.clearCookie("otpToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    res.cookie("authToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.status(200).json({
        status: "Success",
        message: "Successfully Logged In."
    });
}

module.exports = {
    createNewUser,
    loginUser,
    generateOtp,
    validateOtp,
    verifyEmail
}