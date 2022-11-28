/* eslint-disable linebreak-style */
const express = require('express');
const controller = require('../controllers/LoginController');

const router = express.Router();

router.get('/', controller.loginRender);
router.post('/', controller.loginPost);
router.get('/logout', controller.logout);

module.exports = router;
