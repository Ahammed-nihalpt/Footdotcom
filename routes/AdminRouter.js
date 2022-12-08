/* eslint-disable linebreak-style */
const express = require('express');
const controller = require('../controllers/AdminController');
const middleware = require('../middleware/sessionMiddleware');

const router = express.Router();

router.get('/home', middleware.adminSession, controller.adminRender);

// products router
router.get('/home/products', middleware.adminSession, controller.adminProductsRender);
router.get('/home/products/add', middleware.adminSession, controller.adminAddProductRender);
router.post('/home/products/add', middleware.adminSession, controller.adminAddProductpost);
router.get('/home/product/activate/:id', middleware.adminSession, controller.productActivate);
router.get('/home/product/deactivate/:id', middleware.adminSession, controller.productDeactivate);
router.get('/home/product/delete/:id/:img', middleware.adminSession, controller.productDelete);
router.get('/home/product/edit/:id', controller.productEdit);
router.post('/edit/product/:id/:img', controller.productEditPost);

// user router
router.get('/home/users', middleware.adminSession, controller.adminUsersRender);
router.get('/home/user/block/:id', middleware.adminSession, controller.adminBlockUser);
router.get('/home/user/unblock/:id', middleware.adminSession, controller.adminUnblockUser);
router.get('/home/user/delete/:id', middleware.adminSession, controller.adminDeleteUser);

// cartegory
router.get('/home/category', controller.categoryRender);
router.get('/home/category/add', controller.categoryAdd);
router.post('/category/add', controller.categoryAddPost);
router.get('/edit/category/:id', controller.editCategoryRender);
router.post('/edit/category/:id', controller.editCategoryPost);
router.get('/home/subcategory', controller.subcategoryRender);
router.get('/home/subcategory/add', controller.addSubcategoryRender);
router.post('/subcategory/add', controller.addSubcategpryPost);
router.get('/edit/subcategory/:id', controller.editSubcategoryRender);
router.post('/edit/subcategory/:id', controller.editSubcategoryPost);

// Orders
router.get('/home/orders', controller.orderRender);
router.post('/change-status', controller.changeOrderStatus);
router.post('/order-completed', controller.orderCompeleted);
router.post('/order-cancel', controller.orderCancel);

module.exports = router;
