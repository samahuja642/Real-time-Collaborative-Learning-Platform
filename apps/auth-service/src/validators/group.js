const Joi = require('joi');

const GroupSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    logo: Joi.string(),
});

const AddUsersSchema = Joi.object({
    userIds: Joi.array().items(Joi.number()).required(),
    groupId: Joi.number().required(),
});

module.exports = {
    GroupSchema,
    AddUsersSchema,
}