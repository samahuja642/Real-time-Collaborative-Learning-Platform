const express = require('express')
const router = express.Router()
const { createGroup } = require('../controllers');

router.route('/create-group').post(createGroup);

module.exports = router;