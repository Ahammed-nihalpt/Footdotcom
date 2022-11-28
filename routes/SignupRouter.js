/* eslint-disable linebreak-style */
const express = require('express');
const controller = require('../controllers/SignupController');

const router = express.Router();

router.get('/', controller.signupRender);
router.get('/otp', controller.otpRender);
router.post('/otp', controller.otpPost);
router.post('/', controller.signupPost);

module.exports = router;
