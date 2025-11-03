const userController = require('./user');
const groupController = require('./group');

module.exports = {
    ...userController,
    ...groupController,
};