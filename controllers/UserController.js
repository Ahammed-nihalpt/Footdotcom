/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable indent */
const mongoose = require('mongoose');
const moment = require('moment');
const crypto = require('crypto');
const model = require('../models/UsersModel');
const instance = require('../middleware/razorPay');

const landingPageRender = async (req, res) => {
    try {
        if (!req.session.userID) {
            const result = await model.Product.find().limit(7);
            const banner = await model.Banner.find().sort({ name: -1 });
            res.render('Landingpage', { allData: result, banner });
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        res.redirect('/500');
    }
};

const guestProduct = async (req, res) => {
    try {
        const id = mongoose.Types.ObjectId(req.params.id);
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
            model.Category.find().then((cate) => {
                res.render('user/guestProductView', {
                    allData: result,
                    name: req.session.userName,
                    cate,
                });
            });
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const homeGender = async (req, res) => {
    try {
        let id;
        if (req.params.gender === 'men') {
            const sc = await model.SubCategory.findOne({ sub_category_name: 'Men' });
            id = sc._id;
        } else if (req.params.gender === 'women') {
            const sc = await model.SubCategory.findOne({ sub_category_name: 'Women' });
            id = sc._id;
        } else if (req.params.gender === 'kids') {
            const sc = await model.SubCategory.findOne({ sub_category_name: 'Kids' });
            id = sc._id;
        }
        const pageNum = req.query.page;
        const perPage = 8;
        let count = 0;
        const category = await model.Category.find();
        const scategory = await model.SubCategory.find();
        const docCount = await model.Product.find({ $and: [{ product_status: 'active' }, { stock: { $gt: 0 } }, { category: { $in: id } }] })
            .countDocuments();
        model.Product.find({ $and: [{ product_status: 'active' }, { stock: { $gt: 0 } }, { category: { $in: id } }] })
            .skip((pageNum - 1) * perPage)
            .limit(perPage)
            .then((result) => {
                model.Cart.findOne({ user_id: req.session.userID }).then((doc) => {
                    if (doc) {
                        count = doc.products.length;
                    }
                    res.render('user/UserHome', {
                        allData: result,
                        count,
                        name: req.session.userName,
                        category,
                        scategory,
                        currentPage: pageNum,
                        totalDocuments: docCount,
                        pages: Math.ceil(docCount / perPage),
                    });
                });
            })
            .catch(() => {
                res.redirect('/500');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const userHomeRender = async (req, res) => {
    try {
        const pageNum = req.query.page;
        const perPage = 8;
        let count = 0;
        const category = await model.Category.find();
        const scategory = await model.SubCategory.find();
        const docCount = await model.Product.find({ $and: [{ product_status: 'active' }, { stock: { $gt: 0 } }] })
            .countDocuments();
        model.Product.find({ $and: [{ product_status: 'active' }, { stock: { $gt: 0 } }] })
            .skip((pageNum - 1) * perPage)
            .limit(perPage)
            .then((result) => {
                model.Cart.findOne({ user_id: req.session.userID }).then((doc) => {
                    if (doc) {
                        count = doc.products.length;
                    }
                    res.render('user/UserHome', {
                        allData: result,
                        count,
                        name: req.session.userName,
                        category,
                        scategory,
                        currentPage: pageNum,
                        totalDocuments: docCount,
                        pages: Math.ceil(docCount / perPage),
                    });
                });
            })
            .catch(() => {
                res.redirect('/500');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const search = async (req, res) => {
    try {
        const pageNum = req.query.page;
        const perPage = 8;
        let count = 0;
        const searchvalue = req.body.searchinput;
        const category = await model.Category.find();
        const scategory = await model.SubCategory.find();
        const docCount = await model.Product.find({
            $and: [{ product_status: 'active' }, { stock: { $gt: 0 } }, {
                product_name: new RegExp(searchvalue, 'i'),
            }],
        })
            .countDocuments();
        model.Product.find({
            $and: [{ product_status: 'active' }, { stock: { $gt: 0 } }, {
                product_name: new RegExp(searchvalue, 'i'),
            }],
        })
            .skip((pageNum - 1) * perPage)
            .limit(perPage)
            .then((result) => {
                model.Cart.findOne({ user_id: req.session.userID }).then((doc) => {
                    if (doc) {
                        count = doc.products.length;
                    }
                    res.render('user/UserHome', {
                        allData: result,
                        count,
                        name: req.session.userName,
                        category,
                        scategory,
                        currentPage: pageNum,
                        totalDocuments: docCount,
                        pages: Math.ceil(docCount / perPage),
                    });
                });
            })
            .catch(() => {
                res.redirect('/500');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const homeFilter = async (req, res) => {
    try {
        const pageNum = req.query.page;
        const perPage = 8;
        let count = 0;
        const category = await model.Category.find();
        const scategory = await model.SubCategory.find();
        const docCount = await model.Product.find({ $and: [{ product_status: 'active' }, { stock: { $gt: 0 } }] })
            .countDocuments();
        if (Object.keys(req.body).length === 0) {
            model.Product.find({ $and: [{ product_status: 'active' }, { stock: { $gt: 0 } }] }).then((result) => {
                model.Cart.findOne({ user_id: req.session.userID })
                    .skip((pageNum - 1) * perPage)
                    .limit(perPage)
                    .then((doc) => {
                        if (doc) {
                            count = doc.products.length;
                        }
                        res.render('user/UserHome', {
                            allData: result,
                            count,
                            name: req.session.userName,
                            category,
                            scategory,
                            currentPage: pageNum,
                            totalDocuments: docCount,
                            pages: Math.ceil(docCount / perPage),
                        });
                    });
            }).catch(() => {
                res.redirect('/500');
            });
        } else {
            const { ...all } = req.body;
            const arr = [];
            // eslint-disable-next-line no-restricted-syntax
            for (const key in all) {
                if (key) { arr.push(mongoose.Types.ObjectId(all[key])); }
            }
            const docCountt = await model.Product.find({ $and: [{ product_status: 'active' }, { stock: { $gt: 0 } }, { category: { $in: arr } }] })
                .countDocuments();
            const result = await model.Product.find({ $and: [{ product_status: 'active' }, { stock: { $gt: 0 } }, { category: { $in: arr } }] });
            res.render('user/UserHome', {
                allData: result,
                count,
                name: req.session.userName,
                category,
                scategory,
                currentPage: pageNum,
                totalDocuments: docCountt,
                pages: Math.ceil(docCountt / perPage),
            });
        }
    } catch (error) {
        res.redirect('/500');
    }
};

const userProductView = async (req, res) => {
    try {
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
                        model.Wishlist.findOne(
                            {
                                $and: [{ userId: req.session.userID },
                                { product: { $elemMatch: { productId: id } } }],
                            },
                        ).then((wish) => {
                            let wid = '';
                            let inwish = false;
                            if (wish) {
                                inwish = true;
                                // eslint-disable-next-line no-underscore-dangle
                                wid = wish._id;
                            }
                            res.render('user/UserProductView', {
                                allData: result,
                                inCart,
                                count,
                                name: req.session.userName,
                                cate,
                                inwish,
                                wid,
                            });
                        });
                    });
                }).catch(() => {
                    res.redirect('/500');
                });
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const notFound = (req, res) => {
    res.render('404');
};

const wishlistRender = async (req, res) => {
    try {
        const uid = req.session.userID;
        // eslint-disable-next-line no-underscore-dangle
        const cartData = await model.Cart.findOne({ user_id: uid });
        let count = cartData?.products?.length;
        // eslint-disable-next-line no-underscore-dangle
        const wishlistDetails = await model.Wishlist.findOne({ userId: uid });
        let wishCount = wishlistDetails?.product?.length;
        if (wishlistDetails == null) {
            wishCount = 0;
        }
        if (cartData == null) {
            count = 0;
        }
        const wishlistData = await model.Wishlist.aggregate([
            {
                // eslint-disable-next-line object-shorthand
                $match: { userId: uid },
            },
            {
                $unwind: '$product',
            },
            {
                $project: {
                    productItem: '$product.productId',
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
                    productDetail: { $arrayElemAt: ['$productDetail', 0] },
                },
            },
        ]);
        res.render(
            'user/wishlist',
            {
                name: req.session.userName,
                count,
                wishlistData,
                wishCount,
            },
        );
    } catch (error) {
        res.redirect('/500');
    }
};

const addToWishlist = async (req, res) => {
    try {
        const uid = req.session.userID;
        const { pid } = req.body;
        const proObj = {
            productId: pid,
        };
        const userWishlist = await model.Wishlist.findOne({ userId: uid });
        const verify = await model.Cart.findOne(
            { user_id: uid },
            { product: { $elemMatch: { productId: pid } } },
        );
        if (verify?.products?.length) {
            res.json({ cart: true });
        } else {
            // eslint-disable-next-line no-lonely-if
            if (userWishlist) {
                const proExist = userWishlist.product.findIndex(
                    (product) => product.productId === pid,
                );
                if (proExist !== -1) {
                    res.json({ productExist: true });
                } else {
                    model.Wishlist
                        .updateOne({ userId: uid }, { $push: { product: proObj } })
                        .then(() => {
                            res.json({ success: true });
                        });
                }
            } else {
                model.Wishlist
                    .create({
                        userId: uid,
                        product: [
                            {
                                productId: pid,
                            },
                        ],
                    })
                    .then(() => {
                        res.json({ status: true });
                    });
            }
        }
    } catch (error) {
        res.redirect('/500');
    }
};

const removeWishlistProduct = async (req, res) => {
    try {
        const { pid, wid } = req.body;
        await model.Wishlist
            .updateOne(
                { _id: wid, 'product.productId': pid },
                { $pull: { product: { productId: pid } } },
            )
            .then(() => {
                res.json({ status: true });
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const cartRender = (req, res) => {
    try {
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
                res.render('user/cart', {
                    allData: result, count, sum, name: req.session.userName,
                });
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const addToCart = (req, res) => {
    try {
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
                            }).catch(() => {
                                res.redirect('/500');
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
                }).catch(() => {
                    res.redirect('/500');
                });
            }
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

// eslint-disable-next-line no-unused-vars
const cartQuantity = (req, res, next) => {
    try {
        const cartid = req.body.cart;
        const pid = req.body.product;
        const count = Number(req.body.count);
        model.Cart.updateOne(
            { _id: cartid, 'products.product_id': pid },
            {
                $inc: { 'products.$.quantity': count },
            },
        ).then(() => {
            model.Cart.findOne({ _id: cartid, 'products.product_id': pid }).then(() => {
                res.redirect('user/cart');
            });
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

// eslint-disable-next-line no-unused-vars
const cartItemDelete = (req, res, next) => {
    try {
        const cartid = req.body.cart;
        const pid = req.body.product;
        model.Cart.findOneAndUpdate(
            { _id: cartid },
            { $pull: { products: { product_id: pid } } },
        ).then(() => {
            res.redirect('user/cart');
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const checkOutRender = (req, res) => {
    try {
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
                }).catch(() => {
                    res.redirect('/500');
                });
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const confirmOrder = async (req, res) => {
    try {
        const uid = req.session.userID;
        const paymethod = req.body.pay;
        const adrs = req.body.address;
        const { Order } = model;
        const coupon = await model.Coupon.findOne({ coupon_code: req.body.coupon });
        if (coupon) {
            await model.Coupon.updateOne(
                { coupon_code: req.body.coupon },
                {
                    $push: { used_user_id: uid },
                },
            );
        }
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
                        }).catch(() => {
                            res.redirect('/500');
                        });
                    }
                    let dis = 0;
                    let tamount = 0;
                    const sum = result
                        .reduce((accumulator, object) => accumulator + object.productPrice, 0);
                    if (coupon) {
                        dis = (Number(sum) * Number(coupon.offer)) / 100;
                        if (dis > Number(coupon.max_amount)) {
                            dis = Number(coupon.max_amount);
                        }
                        tamount = sum - dis;
                    } else {
                        tamount = sum;
                    }
                    model.Cart.findOne({ user_id: uid }).then((cartData) => {
                        const order = new Order({
                            order_id: Date.now(),
                            user_id: uid,
                            // eslint-disable-next-line no-underscore-dangle
                            address: adrs,
                            order_placed_on: moment().format('DD-MM-YYYY'),
                            products: cartData.products,
                            discount: dis,
                            totalAmount: tamount,
                            paymentMethod: paymethod,
                            expectedDelivery: moment().add(4, 'days').format('MMM Do YY'),
                        });
                        // eslint-disable-next-line no-unused-vars
                        order.save().then((done) => {
                            // eslint-disable-next-line semi, no-underscore-dangle
                            const oid = done._id;
                            model.Cart.deleteOne({ user_id: uid }).then(() => {
                                if (paymethod === 'cod') {
                                    res.json([{ success: true, oid }]);
                                } else if (paymethod === 'online') {
                                    const amount = done.totalAmount * 100;
                                    const options = {
                                        amount,
                                        currency: 'INR',
                                        receipt: `${oid}`,
                                    };
                                    instance.orders.create(options, (err, orders) => {
                                        if (err) {
                                            res.redirect('/500');
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
    } catch (error) {
        res.redirect('/500');
    }
};

const verifyPayment = (req, res) => {
    try {
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
            model.Order
                .updateOne({ _id: objId }, { $set: { paymentStatus: 'Paid' } })
                .then(() => {
                    res.json({ success: true, oid: details.order.receipt });
                })
                .catch(() => {
                    res.json({ status: false, err_message: 'payment failed' });
                });
        } else {
            res.json({ status: false, err_message: 'payment failed' });
        }
    } catch (error) {
        res.redirect('/500');
    }
};

const paymentFailure = (req, res) => {
    try {
        res.send('payment failed');
    } catch (error) {
        res.redirect('/500');
    }
};

const orderSuccessRender = (req, res) => {
    try {
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
            res.render('user/orderSuccess', {
                id: result[0].order_id,
                amount: result[0].totalAmount,
                deladd: result[0].address[0],
                count: result[0].products.length,
                name: result[0].user[0].name,
            });
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const orderHistoryRender = (req, res) => {
    try {
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
            // eslint-disable-next-line no-underscore-dangle
            model.Order.find({ user_id: uid }).then((doc) => {
                res.render('user/orderHistory', {
                    name, count: 0, productData: result, allData: doc, items: 0,
                });
            }).catch(() => {
                res.redirect('/500');
            });
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const profileRender = (req, res) => {
    try {
        const uid = req.session.userID;
        model.Users.findOne({ user_id: uid }).then((userdoc) => {
            model.Address.find({ user_id: uid }).then((address) => {
                res.render('user/profile', { user: userdoc, address });
            }).catch(() => {
                res.redirect('/500');
            });
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const addAddressRender = (req, res) => {
    try {
        const { path } = req.route;
        if (path === '/user/add-address') {
            res.render('user/addAddress');
        } else {
            res.render('user/addAddressCheck');
        }
    } catch (error) {
        res.redirect('/500');
    }
};

const addAddressPost = (req, res) => {
    try {
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
            }
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const editAddressRender = (req, res) => {
    try {
        const { aid } = req.params;
        model.Address.findOne({ _id: aid }).then((doc) => {
            res.render('user/editAddress', { doc });
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const editAddressPost = (req, res) => {
    try {
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
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const deleteAddress = (req, res) => {
    try {
        const { aid } = req.params;
        model.Address.findByIdAndDelete({ _id: aid }).then(() => {
            res.redirect('/user/profile');
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const changePassword = (req, res) => {
    res.render('user/changePassword', { message: '' });
};

const changePasswodPost = (req, res) => {
    try {
        const uid = req.session.userID;
        const { currentPassword, password } = req.body;
        model.Users.findOne({ user_id: uid }).then((result) => {
            if (result.password === currentPassword) {
                if (password === currentPassword) {
                    res.render('user/changePassword', { message: 'old password and new pasword is same' });
                } else {
                    model.Users.findOneAndUpdate({ user_id: uid }, { password }).then(() => {
                        res.redirect('/user/profile');
                    }).catch(() => {
                        res.redirect('/500');
                    });
                }
            } else {
                res.render('user/changePassword', { message: 'Current password do not match' });
            }
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const error = (req, res) => {
    res.render('500');
};

const couponCheck = async (req, res) => {
    const uid = req.session.userID;
    const { code, amount } = req.body;
    const check = await model.Coupon.findOne(
        { coupon_code: code },
    );
    if (check) {
        let used = false;
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < check.used_user_id.length; i++) {
            const element = check.used_user_id[i];
            if (element === uid) {
                used = true;
            }
        }
        if (!used) {
            let discount = 0;
            const off = (Number(amount) * Number(check.offer)) / 100;
            if (off > Number(check.max_amount)) {
                discount = Number(check.max_amount);
            } else {
                discount = off;
            }
            res.json([
                {
                    success: true, dis: discount, code,
                },
                { check },
            ]);
        } else {
            res.json([{ success: false, message: 'Coupon already used' }]);
        }
    } else {
        res.json([{ success: false, message: 'Coupon invalid' }]);
    }
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
    wishlistRender,
    addToWishlist,
    removeWishlistProduct,
    guestProduct,
    error,
    couponCheck,
};
