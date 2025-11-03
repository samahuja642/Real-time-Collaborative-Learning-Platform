const { AppError } = require('@repo/utils');
const { giveAccessSchema } = require('../validators/userPermissions');
const { GiveUserAccessService } = require('../service/userPermissions');


const giveAccessToUser = async (req,res) => {
    if(!req.body || !req.params || !req.params.userId){
        throw new AppError("Bad Request",400);
    }
    const { error } = giveAccessSchema.validate(req.body);
    if(error){
        throw new AppError(error.message,400);
    }
    const { roles } = req.body;
    const userId = parseInt(req.params.userId);
    await GiveUserAccessService(userId,roles);
    res.status(200).json({
        message:`Users access updated successfully.`,
    });
}

module.exports = {
    giveAccessToUser,
}