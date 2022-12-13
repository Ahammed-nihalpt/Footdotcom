/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable indent */
const mongoose = require('mongoose');
const moment = require('moment');
const crypto = require('crypto');
const model = require('../models/UsersModel');
const instance = require('../middleware/razorPay');

const landingPageRender = async (req, res) => {
    if (!req.session.userID) {
        const result = await model.Product.find().limit(7);
        res.render('Landingpage', { allData: result });
    } else {
        res.redirect('/login');
    }
};

const homeGender = async (req, res) => {
    let id;
    console.log(req.params);
    if (req.params.gender === 'men') {
        id = mongoose.Types.ObjectId('6389f58469358426594f7f47');
    } else if (req.params.gender === 'women') {
        id = mongoose.Types.ObjectId('6396ef9df3aea571db60f1de');
    } else if (req.params.gender === 'kids') {
        id = mongoose.Types.ObjectId('6396efa4f3aea571db60f1e2');
    }
    let count = 0;
    const category = await model.Category.find();
    const scategory = await model.SubCategory.find();
    model.Product.find({ $and: [{ product_status: 'active' }, { stock: { $gt: 0 } }, { category: { $in: id } }] }).then((result) => {
        model.Cart.findOne({ user_id: req.session.userID }).then((doc) => {
            if (doc) {
                count = doc.products.length;
            }
            res.render('user/UserHome', {
                allData: result, count, name: req.session.userName, category, scategory,
            });
        });
    }).catch((error) => {
        console.log(error);
    });
};

const userHomeRender = async (req, res) => {
    let count = 0;
    const category = await model.Category.find();
    const scategory = await model.SubCategory.find();
    model.Product.find({ $and: [{ product_status: 'active' }, { stock: { $gt: 0 } }] }).then((result) => {
        model.Cart.findOne({ user_id: req.session.userID }).then((doc) => {
            if (doc) {
                count = doc.products.length;
            }
            res.render('user/UserHome', {
                allData: result, count, name: req.session.userName, category, scategory,
            });
        });
    }).catch((error) => {
        console.log(error);
    });
};

const search = async (req, res) => {
    let count = 0;
    const category = await model.Category.find();
    const scategory = await model.SubCategory.find();
    console.log(req.body);
    const searchvalue = req.body.searchinput;
    model.Product.find({
        $and: [{ product_status: 'active' }, { stock: { $gt: 0 } }, {
            product_name: new RegExp(searchvalue, 'i'),
        }],
    }).then((result) => {
        model.Cart.findOne({ user_id: req.session.userID }).then((doc) => {
            if (doc) {
                count = doc.products.length;
            }
            res.render('user/UserHome', {
                allData: result, count, name: req.session.userName, category, scategory,
            });
        });
    }).catch((error) => {
        console.log(error);
    });
    // const result = await model.Product.find({
    //     product_name: new RegExp(searchvalue, 'i'),
    // });
};

const homeFilter = async (req, res) => {
    console.log(Object.keys(req.body).length);
    let count = 0;
    const category = await model.Category.find();
    const scategory = await model.SubCategory.find();
    if (Object.keys(req.body).length === 0) {
        console.log('hello');
        model.Product.find({ $and: [{ product_status: 'active' }, { stock: { $gt: 0 } }] }).then((result) => {
            model.Cart.findOne({ user_id: req.session.userID }).then((doc) => {
                if (doc) {
                    count = doc.products.length;
                }
                res.render('user/UserHome', {
                    allData: result, count, name: req.session.userName, category, scategory,
                });
            });
        }).catch((error) => {
            console.log(error);
        });
    } else {
        const { ...all } = req.body;
        const arr = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const key in all) {
            if (key) { arr.push(mongoose.Types.ObjectId(all[key])); }
        }
        console.log(arr);
        const result = await model.Product.find({ $and: [{ product_status: 'active' }, { stock: { $gt: 0 } }, { category: { $in: arr } }] });
        console.log(result);
        res.render('user/UserHome', {
            allData: result, count, name: req.session.userName, category, scategory,
        });
    }
};

const userProductView = (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    let count = 0;
    model.Product.aggregate([
        { $match: { _id: id } },
        {
            $lookup: {
                from: 'subcategories',
                localField: 'category',
                foreignField: '_id',
                as: 'product',
            },
        },
    ]).then((result) => {
        model.Cart.findOne(
            {
                $and: [{ user_id: req.session.userID },
                { products: { $elemMatch: { product_id: id } } }],
            },
        )
            .then((doc) => {
                let inCart = false;
                if (doc) {
                    inCart = true;
                    count = doc.products.length;
                }
                model.Category.find().then((cate) => {
                    res.render('user/UserProductView', {
                        allData: result, inCart, count, name: req.session.userName, cate,
                    });
                });
            }).catch((error) => {
                console.log(error);
            });
    }).catch((err) => {
        console.log(err);
    });
};

const notFound = (req, res) => {
    res.render('404');
};

const cartRender = (req, res) => {
    const uid = req.session.userID;
    model.Cart.aggregate([
        {
            $match: { user_id: uid },
        },
        {
            $unwind: '$products',
        },
        {
            $project: {
                productItem: '$products.product_id',
                productQuantity: '$products.quantity',
                productSize: '$products.size',
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: 'productItem',
                foreignField: '_id',
                as: 'productDetail',
            },
        },
        {
            $project: {
                productItem: 1,
                productQuantity: 1,
                productSize: 1,
                productDetail: { $arrayElemAt: ['$productDetail', 0] },
            },
        },
        {
            $addFields: {
                productPrice: {
                    $sum: { $multiply: ['$productQuantity', '$productDetail.price'] },
                },
            },
        },
    ])
        .exec().then((result) => {
            // console.log(result);
            const sum = result
                .reduce((accumulator, object) => accumulator + object.productPrice, 0);
            const count = result.length;
            res.render('user/cart', {
                allData: result, count, sum, name: req.session.userName,
            });
        });
};

const addToCart = (req, res) => {
    const { size, pid } = req.body;
    const uid = req.session.userID;
    const { Cart } = model;
    Cart.findOne({ user_id: uid }).then((result) => {
        if (result) {
            model.Cart.findOne(
                {
                    $and: [{ user_id: req.session.userID },
                    { products: { $elemMatch: { product_id: pid } } }],
                },
            )
                .then((docs) => {
                    if (!docs) {
                        Cart.findOneAndUpdate(
                            { user_id: uid },
                            {
                                $push:
                                {
                                    products:
                                    {
                                        product_id: pid,
                                        quantity: 1,
                                        size: Number(size),
                                    },
                                },
                            },
                        )
                            .then(() => {
                                res.redirect(`/user/home/${pid}`);
                            });
                    } else {
                        model.Cart.updateOne(
                            { 'products.product_id': pid },
                            {
                                $inc: { 'products.$.quantity': 1 },
                            },
                        ).then(() => {
                            res.redirect('user/cart');
                        }).catch((er) => {
                            console.log(er);
                        });
                    }
                });
        } else {
            const cart = new Cart({
                user_id: uid,
                products: {
                    product_id: pid,
                    quantity: 1,
                    size: Number(size),
                },
            });
            cart.save().then(() => {
                res.redirect(`/user/home/${pid}`);
            }).catch((e) => {
                console.log(e);
            });
        }
    }).catch((error) => {
        console.log(error);
    });
};

// eslint-disable-next-line no-unused-vars
const cartQuantity = (req, res, next) => {
    const cartid = req.body.cart;
    const pid = req.body.product;
    const count = Number(req.body.count);
    model.Cart.updateOne(
        { _id: cartid, 'products.product_id': pid },
        {
            $inc: { 'products.$.quantity': count },
        },
        // eslint-disable-next-line no-unused-vars
    ).then((success) => {
        console.log(success);
        model.Cart.findOne({ _id: cartid, 'products.product_id': pid }).then((result) => {
            console.log(result);
            res.redirect('user/cart');
        });
    }).catch((er) => {
        console.log(er);
    });
};

// eslint-disable-next-line no-unused-vars
const cartItemDelete = (req, res, next) => {
    const cartid = req.body.cart;
    const pid = req.body.product;
    model.Cart.findOneAndUpdate(
        { _id: cartid },
        { $pull: { products: { product_id: pid } } },
    ).then(() => {
        res.redirect('user/cart');
    }).catch((error) => {
        console.log(error);
    });
};

const checkOutRender = (req, res) => {
    const uid = req.session.userID;
    model.Cart.aggregate([
        {
            $match: { user_id: uid },
        },
        {
            $unwind: '$products',
        },
        {
            $project: {
                productItem: '$products.product_id',
                productQuantity: '$products.quantity',
                productSize: '$products.size',
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: 'productItem',
                foreignField: '_id',
                as: 'productDetail',
            },
        },
        {
            $project: {
                productItem: 1,
                productQuantity: 1,
                productSize: 1,
                productDetail: { $arrayElemAt: ['$productDetail', 0] },
            },
        },
        {
            $addFields: {
                productPrice: {
                    $sum: { $multiply: ['$productQuantity', '$productDetail.price'] },
                },
            },
        },
    ])
        .exec().then((result) => {
            const sum = result
                .reduce((accumulator, object) => accumulator + object.productPrice, 0);
            const count = result.length;
            model.Address.find({ user_id: uid }).then((adrss) => {
                res.render('user/checkOutPage', {
                    allData: result, count, sum, name: req.session.userName, address: adrss,
                });
            }).catch((e) => {
                console.log(e);
            });
        });
};

const confirmOrder = (req, res) => {
    // console.log('nihal');
    const uid = req.session.userID;
    const paymethod = req.body.pay;
    const adrs = req.body.address;
    const { Order } = model;
    // eslint-disable-next-line no-unused-vars
    model.Users.findOne({ user_id: uid }).then((userData) => {
        model.Cart.aggregate([
            {
                $match: { user_id: uid },
            },
            {
                $unwind: '$products',
            },
            {
                $project: {
                    productItem: '$products.product_id',
                    productQuantity: '$products.quantity',
                    productSize: '$products.size',
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productItem',
                    foreignField: '_id',
                    as: 'productDetail',
                },
            },
            {
                $project: {
                    productItem: 1,
                    productQuantity: 1,
                    productSize: 1,
                    productDetail: { $arrayElemAt: ['$productDetail', 0] },
                },
            },
            {
                $addFields: {
                    productPrice: {
                        $sum: { $multiply: ['$productQuantity', '$productDetail.price'] },
                    },
                },
            },
        ])
            .exec().then((result) => {
                // eslint-disable-next-line no-plusplus
                for (let i = 0; i < result.length; i++) {
                    const csctock = result[i].productDetail.stock - result[i].productQuantity;
                    model.Product.findByIdAndUpdate(
                        // eslint-disable-next-line no-underscore-dangle
                        { _id: result[i].productDetail._id },
                        { stock: csctock },
                    ).then(() => {
                    }).catch((erp) => {
                        console.log(erp);
                    });
                }
                // const count = result.length;
                const sum = result
                    .reduce((accumulator, object) => accumulator + object.productPrice, 0);
                model.Cart.findOne({ user_id: uid }).then((cartData) => {
                    const order = new Order({
                        order_id: Date.now(),
                        user_id: uid,
                        // eslint-disable-next-line no-underscore-dangle
                        address: adrs,
                        order_placed_on: moment().format('DD-MM-YYYY'),
                        products: cartData.products,
                        totalAmount: sum,
                        paymentMethod: paymethod,
                        expectedDelivery: moment().add(4, 'days').format('MMM Do YY'),
                    });
                    // eslint-disable-next-line no-unused-vars
                    order.save().then((done) => {
                        // eslint-disable-next-line semi, no-underscore-dangle
                        const oid = done._id;
                        model.Cart.deleteOne({ user_id: uid }).then(() => {
                            if (paymethod === 'cod') {
                                // console.log('nop');
                                res.json([{ success: true, oid }]);
                            } else if (paymethod === 'online') {
                                console.log('nihhal');
                                const amount = done.totalAmount * 100;
                                const options = {
                                    amount,
                                    currency: 'INR',
                                    receipt: `${oid}`,
                                };
                                instance.orders.create(options, (err, orders) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.json([{ success: false, orders }]);
                                    }
                                });
                            }
                        });
                    });
                });
            });
    });
};

const verifyPayment = (req, res) => {
    console.log('ver');
    const details = req.body;
    let hmac = crypto.createHmac('sha256', 'uYglaEyoaZ1j8MXmPiCDHfZi');
    hmac.update(
        // eslint-disable-next-line operator-linebreak, prefer-template
        details.payment.razorpay_order_id +
        // eslint-disable-next-line operator-linebreak
        '|' +
        // eslint-disable-next-line comma-dangle
        details.payment.razorpay_payment_id
    );
    hmac = hmac.digest('hex');
    // eslint-disable-next-line eqeqeq
    if (hmac == details.payment.razorpay_signature) {
        const objId = mongoose.Types.ObjectId(details.order.receipt);
        console.log(objId);
        model.Order
            .updateOne({ _id: objId }, { $set: { paymentStatus: 'Paid' } })
            .then(() => {
                res.json({ success: true, oid: details.order.receipt });
            })
            .catch((err) => {
                console.log(err);
                res.json({ status: false, err_message: 'payment failed' });
            });
    } else {
        res.json({ status: false, err_message: 'payment failed' });
    }
};

const paymentFailure = (req, res) => {
    const details = req.body;
    console.log(details);
    res.send('payment failed');
};

const orderSuccessRender = (req, res) => {
    console.log(req.params);
    const oid = mongoose.Types.ObjectId(req.params.oid);
    model.Order.aggregate([
        { $match: { _id: oid } },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: 'user_id',
                as: 'user',
            },
        },
        {
            $lookup: {
                from: 'addresses',
                localField: 'address',
                foreignField: '_id',
                as: 'address',
            },
        },
    ]).then((result) => {
        console.log(result);
        res.render('user/orderSuccess', {
            id: result[0].order_id,
            amount: result[0].totalAmount,
            deladd: result[0].address[0],
            count: result[0].products.length,
            name: result[0].user[0].name,
        });
    });
};

const orderHistoryRender = (req, res) => {
    const name = req.session.userName;
    const uid = req.session.userID;
    model.Order.aggregate([
        {
            $match: { user_id: uid },
        },
        {
            $unwind: '$products',
        },
        {
            $project: {
                productItem: '$products.product_id',
                productQuantity: '$products.quantity',
                productSize: '$products.size',
                order_id: 1,
                address: 1,
                expectedDelivery: 1,
                totalAmount: 1,
                paymentMethod: 1,
                paymentStatus: 1,
                orderStatus: 1,
                createdAt: 1,
            },
        },
        {
            $lookup: {
                from: 'products',
                localField: 'productItem',
                foreignField: '_id',
                as: 'productDetail',
            },
        },
        {
            $unwind: '$productDetail',
        },
        {
            $addFields: {
                productPrice: {
                    $sum: { $multiply: ['$productQuantity', '$productDetail.price'] },
                },
            },
        },
    ]).then((result) => {
        console.log(result);
        // eslint-disable-next-line no-underscore-dangle
        model.Order.find({ user_id: 'aa8e7f6f-6176-41f1-8677-4cb23efea371' }).then((doc) => {
            // const items = doc.products.length;
            res.render('user/orderHistory', {
                name, count: 0, productData: result, allData: doc, items: 0,
            });
        });
    });
};

const profileRender = (req, res) => {
    const uid = req.session.userID;
    model.Users.findOne({ user_id: uid }).then((userdoc) => {
        model.Address.find({ user_id: uid }).then((address) => {
            res.render('user/profile', { user: userdoc, address });
        });
    });
};

const addAddressRender = (req, res) => {
    const { path } = req.route;
    if (path === '/user/add-address') {
        res.render('user/addAddress');
    } else {
        res.render('user/addAddressCheck');
    }
};

const addAddressPost = (req, res) => {
    const { path } = req.route;
    const uid = req.session.userID;
    const {
        address,
        state,
        city,
        pincode,
    } = req.body;
    const { Address } = model;
    const addressobj = new Address({
        // eslint-disable-next-line no-underscore-dangle
        user_id: uid,
        address,
        state,
        city,
        pincode,
    });
    addressobj.save().then((results) => {
        if (results) {
            if (path === '/user/add-address') {
                res.redirect('/user/profile');
            } else {
                res.redirect('/checkout');
            }
        } else {
            console.log('error inserting addess');
        }
    });
};

const editAddressRender = (req, res) => {
    const { aid } = req.params;
    model.Address.findOne({ _id: aid }).then((doc) => {
        res.render('user/editAddress', { doc });
    });
};

const editAddressPost = (req, res) => {
    const { aid } = req.params;
    const {
        address,
        state,
        city,
        pincode,
    } = req.body;
    model.Address.findByIdAndUpdate(
        { _id: aid },
        {
            address, state, city, pincode,
        },
    ).then(() => {
        res.redirect('/user/profile');
    });
};

const deleteAddress = (req, res) => {
    const { aid } = req.params;
    model.Address.findByIdAndDelete({ _id: aid }).then(() => {
        res.redirect('/user/profile');
    });
};

const changePassword = (req, res) => {
    res.render('user/changePassword', { message: '' });
};

const changePasswodPost = (req, res) => {
    const uid = req.session.userID;
    const { currentPassword, password } = req.body;
    model.Users.findOne({ user_id: uid }).then((result) => {
        if (result.password === currentPassword) {
            if (password === currentPassword) {
                res.render('user/changePassword', { message: 'old password and new pasword is same' });
            } else {
                model.Users.findOneAndUpdate({ user_id: uid }, { password }).then(() => {
                    res.redirect('/user/profile');
                });
            }
        } else {
            res.render('user/changePassword', { message: 'Current password do not match' });
        }
    });
};

module.exports = {
    landingPageRender,
    userHomeRender,
    homeFilter,
    search,
    userProductView,
    notFound,
    cartRender,
    addToCart,
    cartItemDelete,
    cartQuantity,
    checkOutRender,
    confirmOrder,
    orderHistoryRender,
    profileRender,
    addAddressPost,
    addAddressRender,
    editAddressRender,
    editAddressPost,
    deleteAddress,
    changePassword,
    changePasswodPost,
    orderSuccessRender,
    verifyPayment,
    paymentFailure,
    homeGender,
};
