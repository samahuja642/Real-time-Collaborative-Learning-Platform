const { cacheRolesData } = require("../cache");
const { REDIS_KEYS } = require("../constants");
const { dbGetRoleIDForStudent } = require("../data-access");
const { dbGetAllRoles } = require('../data-access');
const { redis } = require("./redis");

const cacheDefaultRoleId = async () => {
    const studentRoleId = await dbGetRoleIDForStudent();
    if(studentRoleId)await redis.set(REDIS_KEYS.ROLE("student"),studentRoleId);
}

const cacheAllRoleData = async () => {
    const roles = await dbGetAllRoles();
    if(roles)await cacheRolesData(roles);
}

module.exports = {
    cacheDefaultRoleId,
    cacheAllRoleData,
}