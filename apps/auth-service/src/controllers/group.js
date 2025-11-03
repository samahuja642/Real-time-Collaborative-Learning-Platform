const { AppError } = require('@repo/utils');
const { GroupSchema, AddUsersSchema } = require('../validators/group');
const { CreateGroupService } = require('../service/group');

const createGroup = async (req,res) => {
    if(!req.body)throw new new AppError("Bad Request",400);
    const {error} = GroupSchema.validate(req.body);
    if(error)return new new AppError(error.message,400);
    const userId = req.user.id;
    await CreateGroupService(req.body,userId);
    res.send("Created Group");
};

const addUsersToGroup = async (req,res) => {
    if(!req.body)throw new AppError("Bad Request",400);
    const {error} = AddUsersSchema.validate(req.body);
    if(error)return new AppError(error.message,400);
    const {userIds,groupId} = req.body;
    await AddUserService(userIds,groupId);
}

module.exports = {
    createGroup,
}