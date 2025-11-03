const { dbCreateGroup } = require("../data-access");

const CreateGroupService = async (groupDetails,userId) => {
    await dbCreateGroup(groupDetails,userId);
};

const AddUserService = async (userIds,groupId) => {
    await dbAddUsersIntoGroup(userIds,groupId);
};

module.exports = {
    CreateGroupService,
}