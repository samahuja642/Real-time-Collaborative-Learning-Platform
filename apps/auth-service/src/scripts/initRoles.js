const { REDIS_KEYS } = require("../constants");
const { dbGetRoleIDForStudent } = require("../data-access");
const { redis } = require("./redis");

const cacheDefaultRoleId = async () => {
    const studentRoleId = await dbGetRoleIDForStudent();
    if(studentRoleId)await redis.set(REDIS_KEYS.ROLE("student"),studentRoleId);
}

module.exports = {
    cacheDefaultRoleId,
}