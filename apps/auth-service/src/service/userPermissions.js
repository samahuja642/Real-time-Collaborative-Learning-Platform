const { getCachedRolesData } = require("../cache");
const { dbFindUserById, dbSetRolesForUser } = require("../data-access");
const { AppError } = require('@repo/utils');

const GiveUserAccessService = async (userId,roles) => {
    await dbFindUserById(userId);
    const dbRoles = await getCachedRolesData();
    const roleToId = new Map(dbRoles.map(r=>[r.name,r.id]));
    const roleIds = roles.map(r=>{
        if(roleToId.has(r))return roleToId.get(r);
        return null;
    }).filter(item=>!!item);
    await dbSetRolesForUser(userId,roleIds);
}

module.exports = {
    GiveUserAccessService,
}