const argon2 = require('argon2');
const { getCachedRoleId, setUserToCache, getSignUpUserFromCache, getCachedUserBasedOnEmail, setCachedUserBasedOnEmail, setCachedOtpData, getCachedOtpData, deleteCachedOtpData } = require('../cache');
const { dbAddUser,dbFindUserByEmail, dbSaveOtp, dbVerifyOtpData, dbDeleteOtpData } = require('../data-access');
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const { AppError } = require('@repo/utils');
const { OTP_REQUIRED, EMAIL_VERIFICATION_TIME, REDIS_KEYS, CACHE_TIME } = require('../constants');
const { sendOtpEmail, sendEmailVerificationMail } = require('@repo/utils/src/libs/email');
const { cacheDefaultRoleId } = require('../scripts/initRoles');

const RegisterNewUserService = async (user) => {
    const userDB = await dbFindUserByEmail(user.email,false);
    if(userDB){
        throw new AppError("User Already Exists.",400);
    }
    const hash = await argon2.hash(user.password);
    let role = await getCachedRoleId("student");
    if(!role){
        role = await cacheDefaultRoleId();
    }
    if(!role)throw AppError("Something Went Wrong!",500);
    const info = await setUserToCache({
        name:user.name,
        hash,
        email:user.email,
        role,
    });
    const token =  jwt.sign(info,process.env.JWT_SECRET, { expiresIn: EMAIL_VERIFICATION_TIME });
    await sendEmailVerificationMail(user.email,`${process.env.FRONTEND_URL}?token=${token}`,EMAIL_VERIFICATION_TIME/60);
} 

const VerifyEmailService = async (token) => {
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET,function(err,decodedOtpToken){
        if(err){
            console.log('error',err);
            throw new AppError("Invalid Link, Please Regenerate.", 400);
        }
        return decodedOtpToken;
    });
    if(!decodedToken || !decodedToken.uid || !decodedToken.email){
        throw new AppError("Invalid Link. It's not you. It's us.",500);
    }
    const userObject = await getSignUpUserFromCache(decodedToken);
    await dbAddUser(userObject);
}

const LoginUserService = async ({email,password}) => {
    let user = await getCachedUserBasedOnEmail(email);
    if(!user){
        user = await dbFindUserByEmail(email);
        await setCachedUserBasedOnEmail(email,user);
    }
    console.log('user djfjdkj',user);
    if(!user.salt){
        throw new AppError("Something went wrong!",500);
    }
    const shouldLogin = await argon2.verify(user.salt,password);
    if(shouldLogin){
        const token = jwt.sign({
            userId: user.id,
            email: user.email,
            authStatus: OTP_REQUIRED,
        }, process.env.JWT_SECRET, { expiresIn: CACHE_TIME.LESS })
        return token;
    }
    throw new AppError("Incorrect Password/Email",403);
}

const OtpService = async (otpToken) => {
    const decodedOtpToken = jwt.verify(otpToken,process.env.JWT_SECRET,function(err,decodedOtpToken){
        if(err){
            throw new AppError("Invalid Otp token", 400);
        }
        return decodedOtpToken;
    });
    if(!decodedOtpToken.authStatus && decodedOtpToken.authStatus!==OTP_REQUIRED){
        throw new AppError("Invalid Otp token", 400);
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const { userId,email } = decodedOtpToken;
    await dbSaveOtp(userId,otp);
    await sendOtpEmail(email,otp);
}

const OtpVerificationService = async (otpToken,otp) => {
    const decodedOtpToken = await jwt.verify(otpToken,process.env.JWT_SECRET,function(err,decodedOtpToken){
        if(err){
            throw new AppError("Invalid Otp token", 400);
        }
        return decodedOtpToken;
    });
    if(!decodedOtpToken.authStatus && decodedOtpToken.authStatus!==OTP_REQUIRED){
        throw new AppError("Invalid Otp token", 400);
    }
    let data = await getCachedOtpData(decodedOtpToken.userId);
    if(!data){
        data = await dbVerifyOtpData(decodedOtpToken.userId);
        await setCachedOtpData(decodedOtpToken.userId,data);
    }
    const { roles, otp:otpDb } = data;
    if(`${otpDb}`!== otp){
        throw new AppError("Invalid OTP",401);
    }
    await deleteCachedOtpData(decodedOtpToken.userId);
    await dbDeleteOtpData(decodedOtpToken.userId);
    const token = jwt.sign({
        userId: decodedOtpToken.userId,
        roles: roles,
        iat: Math.floor(Date.now() / 1000) - 30,
    }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jwt.sign({
        userId: decodedOtpToken.userId,
        roles,
        iat: Math.floor(Date.now() / 1000) - 30,
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { token,refreshToken };
}

module.exports = {
    RegisterNewUserService,
    LoginUserService,
    OtpService,
    OtpVerificationService,
    VerifyEmailService,
}