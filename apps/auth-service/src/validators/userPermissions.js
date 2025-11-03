const Joi = require('joi');

const giveAccessSchema = Joi.object({
    roles: Joi.array().items(Joi.string()).required(),
});

module.exports = {
    giveAccessSchema,
}