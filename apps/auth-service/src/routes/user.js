const express = require('express')
const router = express.Router()
const { createNewUser, loginUser, generateOtp, validateOtp, verifyEmail } = require('../controllers');

router.route('/signup').post(createNewUser);
router.route('/verify-email').post(verifyEmail);
router.route('/login').post(loginUser);
router.route('/generate-otp').get(generateOtp);
router.route('/validate-otp').post(validateOtp);
// router.route('/delete/:userId').delete(deleteUser);

module.exports = router;