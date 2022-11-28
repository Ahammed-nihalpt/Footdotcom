/* eslint-disable linebreak-style */
const express = require('express');
const controller = require('../controllers/UserController');

const router = express.Router();

router.get('/', controller.landingPageRender);
router.get('/user/home', controller.userHomeRender);
router.get('/user/home/:id', controller.userProductView);

module.exports = router;
