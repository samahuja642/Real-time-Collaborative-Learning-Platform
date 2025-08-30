const OTP_REQUIRED = "OTP_REQUIRED";
const OTP_SUCESS = "OTP_SUCESS";
const OTP_LENGTH = 6;
const EMAIL_VERIFICATION_TIME = 300;
const CACHE_TIME = {
    LESS:300,
    MEDIUM:600,
    LONG:1800,
    VERY_LONG:6000,
}

const REDIS_KEYS = {
    ROLE: (roleName) => `role:${roleName}`,
    VERIFY_EMAIL: (uid,email) => `verify-email:${uid}-${email}`, 
    USER_BY_EMAIL: (email) => `user-by-email:${email}`,
    OTP: (userId) => `otp-user:${userId}`,
    // USER: (userId) => `user:${userId}`,
    // OTP: (userId) => `otp:${userId}`,
    // GROUP: (groupId) => `group:${groupId}`,
}

module.exports = {
    OTP_REQUIRED,
    OTP_SUCESS,
    OTP_LENGTH,
    EMAIL_VERIFICATION_TIME,
    CACHE_TIME,
    REDIS_KEYS,
}