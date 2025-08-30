const { v4:uuidv4 } = require('uuid');
const { REDIS_KEYS, EMAIL_VERIFICATION_TIME, CACHE_TIME } = require('../constants');
const { redis } = require('../scripts/redis');

const getCachedRoleId = async (roleName) => {
    const role = await redis.get(REDIS_KEYS.ROLE(roleName));
    return parseInt(role) || null;
}

const setUserToCache = async ({name,hash,email,role}) => {
    const uid = uuidv4();
    await redis.set(
        REDIS_KEYS.VERIFY_EMAIL(uid,email),
        JSON.stringify({
            name,
            salt: hash,
            email,
            role,
        }),
        "EX", EMAIL_VERIFICATION_TIME
    );
    return {
        uid,
        email
    };
}

const getSignUpUserFromCache = async (decodedToken) => {
    const userObject = await redis.get(REDIS_KEYS.VERIFY_EMAIL(decodedToken.uid,decodedToken.email));
    await redis.del(REDIS_KEYS.VERIFY_EMAIL(decodedToken.uid,decodedToken.email));
    return JSON.parse(userObject);
}

const getCachedUserBasedOnEmail = async (email) => {
    return JSON.parse(await redis.get(REDIS_KEYS.USER_BY_EMAIL(email)));
}

const setCachedUserBasedOnEmail = async (email,user) => {
    return await redis.set(REDIS_KEYS.USER_BY_EMAIL(email),JSON.stringify(user),"EX",CACHE_TIME.MEDIUM);
}

const getCachedOtpData = async (userId) => {
    return JSON.parse(await redis.get(REDIS_KEYS.OTP(userId)));
}

const setCachedOtpData = async (userId,data) => {
    return await redis.set(REDIS_KEYS.OTP(userId),JSON.stringify(data),"EX",CACHE_TIME.LESS);
}

const deleteCachedOtpData = async (userId) => {
    return await redis.del(REDIS_KEYS.OTP(userId));
}

module.exports = {
    getCachedRoleId,
    setUserToCache,
    getSignUpUserFromCache,
    getCachedUserBasedOnEmail,
    setCachedUserBasedOnEmail,
    getCachedOtpData,
    setCachedOtpData,
    deleteCachedOtpData,
}