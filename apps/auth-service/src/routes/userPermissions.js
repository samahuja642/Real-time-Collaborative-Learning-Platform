const express = require('express');
const { giveAccessToUser } = require('../controllers/userPermissions');
const router = express.Router();

router.route('/give-access/:userId').post(giveAccessToUser);

module.exports = router;