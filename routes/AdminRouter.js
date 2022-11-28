/* eslint-disable linebreak-style */
const express = require('express');
const controller = require('../controllers/AdminController');

const router = express.Router();

router.get('/home', controller.adminRender);

// products router
router.get('/home/products', controller.adminProductsRender);
router.get('/home/products/add', controller.adminAddProductRender);
router.post('/home/products/add', controller.adminAddProductpost);
router.get('/home/product/activate/:id', controller.productActivate);
router.get('/home/product/deactivate/:id', controller.productDeactivate);
router.get('/home/product/delete/:id/:img', controller.productDelete);

// user router
router.get('/home/users', controller.adminUsersRender);
router.get('/home/user/block/:id', controller.adminBlockUser);
router.get('/home/user/unblock/:id', controller.adminUnblockUser);
router.get('/home/user/delete/:id', controller.adminDeleteUser);

module.exports = router;
