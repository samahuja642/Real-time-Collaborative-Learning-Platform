const userValidations = require('./user');
const groupValidtations = require('./group');

module.exports = {
    ...userValidations,
    ...groupValidtations,
};