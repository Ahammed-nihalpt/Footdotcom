/* eslint-disable linebreak-style */
const express = require('express');
const middleware = require('../middleware/sessionMiddleware');
const controller = require('../controllers/UserController');

const router = express.Router();

// landingpage
router.get('/', controller.landingPageRender);

// homePage
router.get('/user/home', middleware.userSession, controller.userHomeRender);
router.get('/user/home/:id', middleware.userSession, controller.userProductView);

// cart
router.get('/user/cart', middleware.userSession, controller.cartRender);
router.get('/user/addtocart/:pid', middleware.userSession, controller.addToCart);
router.post('/change-product-quantity', middleware.userSession, controller.cartQuantity);
router.post('/delete-cart-product', middleware.userSession, controller.cartItemDelete);

// checkout
router.get('/checkout', middleware.userSession, controller.checkOutRender);

// order confirm
router.post('/order-confirmed', middleware.userSession, controller.confirmOrder);

// order history
router.get('/user/order-history', middleware.userSession, controller.orderHistoryRender);

// profile
router.get('/user/profile', middleware.userSession, controller.profileRender);
// address
router.get('/user/add-address', middleware.userSession, controller.addAddressRender);
router.post('/user/add-address', middleware.userSession, controller.addAddressPost);
router.get('/user/add-address/checkout', middleware.userSession, controller.addAddressRender);
router.post('/user/add-address/checkout', middleware.userSession, controller.addAddressPost);
router.get('/user/edit-address/:aid', middleware.userSession, controller.editAddressRender);
router.post('/user/edit-address/:aid', middleware.userSession, controller.editAddressPost);
router.get('/user/delete-address/:aid', middleware.userSession, controller.deleteAddress);
// change password
router.get('/user/change-password', middleware.userSession, controller.changePassword);
router.post('/user/change-password', middleware.userSession, controller.changePasswodPost);

// 404
router.get('/404', controller.notFound);

module.exports = router;
