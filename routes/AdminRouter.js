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
router.get('/home/product/edit/:id', middleware.adminSession, controller.productEdit);
router.post('/home/addsize', middleware.adminSession, controller.addSize);
router.post('/edit/product/:id/:img', middleware.adminSession, controller.productEditPost);

// user router
router.get('/home/users', middleware.adminSession, controller.adminUsersRender);
router.get('/home/user/block/:id', middleware.adminSession, controller.adminBlockUser);
router.get('/home/user/unblock/:id', middleware.adminSession, controller.adminUnblockUser);
router.get('/home/user/delete/:id', middleware.adminSession, controller.adminDeleteUser);

// cartegory
router.get('/home/category', middleware.adminSession, controller.categoryRender);
router.get('/home/category/add', middleware.adminSession, controller.categoryAdd);
router.post('/category/add', middleware.adminSession, controller.categoryAddPost);
router.get('/edit/category/:id', middleware.adminSession, controller.editCategoryRender);
router.post('/edit/category/:id', middleware.adminSession, controller.editCategoryPost);
router.get('/home/subcategory', middleware.adminSession, controller.subcategoryRender);
router.get('/home/subcategory/add', middleware.adminSession, controller.addSubcategoryRender);
router.post('/subcategory/add', middleware.adminSession, controller.addSubcategpryPost);
router.get('/edit/subcategory/:id', middleware.adminSession, controller.editSubcategoryRender);
router.post('/edit/subcategory/:id', middleware.adminSession, controller.editSubcategoryPost);

// Orders
router.get('/home/orders', middleware.adminSession, controller.orderRender);
router.post('/change-status', middleware.adminSession, controller.changeOrderStatus);
router.post('/order-completed', middleware.adminSession, controller.orderCompeleted);
router.post('/order-cancel', middleware.adminSession, controller.orderCancel);

// sales report
router.get('/home/salesreport', controller.salesReportRender);
router.post('/salesreport/customdate', middleware.adminSession, controller.salesCustomDate);

// Banner
router.get('/home/banner', controller.bannerRender);
router.get('/home/banner/add', controller.addBannerRender);
router.post('/home/banner/add', controller.addBannerPost);
router.get('/home/banner/delete/:id', controller.deleteBanner);

module.exports = router;
