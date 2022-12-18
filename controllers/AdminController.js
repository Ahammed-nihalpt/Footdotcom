/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable indent */
const fs = require('fs');
const moment = require('moment');
const model = require('../models/UsersModel');

const adminRender = async (req, res) => {
    try {
        // eslint-disable-next-line no-unused-vars
        const userCount = await model.Users.countDocuments({});
        const productCount = await model.Product.countDocuments({});
        const orderData = await model.Order.find({ orderStatus: { $ne: 'Cancelled' } });
        const orderCount = await model.Order.countDocuments({});
        const pendingOrder = await model.Order.find({ orderStatus: 'Pending' }).count();
        const completed = await model.Order.find({ orderStatus: 'Completed' }).count();
        const delivered = await model.Order.find({ orderStatus: 'Delivered' }).count();
        const cancelled = await model.Order.find({ orderStatus: 'Cancelled' }).count();
        const cod = await model.Order.find({ paymentMethod: 'cod' }).count();
        const online = await model.Order.find({ paymentMethod: 'online' }).count();
        // eslint-disable-next-line arrow-body-style
        const totalAmount = orderData.reduce((accumulator, object) => {
            // eslint-disable-next-line no-return-assign, no-param-reassign
            return (accumulator += object.totalAmount);
        }, 0);
        res.render('admin/adminHome', {
            usercount: userCount,
            productcount: productCount,
            totalamount: totalAmount,
            ordercount: orderCount,
            pending: pendingOrder,
            completed,
            delivered,
            cancelled,
            cod,
            online,
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const adminProductsRender = (req, res) => {
    try {
        // eslint-disable-next-line no-unused-vars
        const findProducts = model.Product.aggregate([
            {
                $lookup: {
                    from: 'subcategories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'product',
                },
            },
        ])
            .then((rsult) => {
                model.Category.find().then((doc) => {
                    res.render('admin/adminProducts', { allData: rsult, category: doc });
                });
            }).catch(() => {
                res.redirect('/500');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const adminUsersRender = (req, res) => {
    try {
        model.Users.find({ account_type: 'user' })
            .then((result) => {
                res.render('admin/adminUsers', { allData: result });
            })
            .catch(() => {
                res.redirect('/500');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const adminUnblockUser = (req, res) => {
    try {
        // eslint-disable-next-line no-unused-vars
        const blockUser = model.Users.findByIdAndUpdate({ _id: req.params.id }, { user_status: 'active' })
            .then(() => {
                res.redirect('/admin/home/users');
            }).catch(() => {
                res.redirect('/500');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const adminBlockUser = (req, res) => {
    try {
        // eslint-disable-next-line no-unused-vars
        const blockUser = model.Users.findByIdAndUpdate({ _id: req.params.id }, { user_status: 'blocked' })
            .then(() => {
                res.redirect('/admin/home/users');
            }).catch(() => {
                res.redirect('/500');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const adminDeleteUser = (req, res) => {
    try {
        // eslint-disable-next-line no-unused-vars
        const deleteUser = model.Users.findByIdAndDelete({ _id: req.params.id }).then((result) => {
            // eslint-disable-next-line no-unused-vars
            const deleteUserAdd = model.Address.findOneAndDelete({ user_id: req.params.id })
                // eslint-disable-next-line no-unused-vars
                .then((results) => {
                    res.redirect('/admin/home/users');
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

const adminAddProductRender = (req, res) => {
    try {
        model.SubCategory.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category_id',
                    foreignField: '_id',
                    as: 'cate',
                },
            },
            { $unwind: '$cate' },
        ]).then((docs) => {
            model.Category.find().then((result) => {
                res.render('admin/adminAddProducts', { sub: docs, main: result });
            });
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const adminAddProductpost = async (req, res) => {
    try {
        const image = req.files.prodcutImage;
        // eslint-disable-next-line prefer-destructuring
        const Product = model.Product;
        // eslint-disable-next-line prefer-destructuring
        const {
            prodcutName,
            price,
            stock,
            color,
            size,
            brand,
            ...cate
        } = req.body;
        const categories = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const key in cate) {
            if (key) { categories.push(cate[key]); }
        }
        // eslint-disable-next-line comma-dangle, prefer-template, no-unused-vars
        const fileName = Date.now() + '.jpg';
        // eslint-disable-next-line prefer-template, no-unused-vars
        await image.mv('./public/images/' + fileName, (err, done) => {
            if (!err) {
                const product = new Product({
                    product_img: fileName,
                    product_name: prodcutName,
                    // eslint-disable-next-line camelcase
                    price,
                    stock,
                    // eslint-disable-next-line no-underscore-dangle
                    category: categories,
                    brand,
                    color,
                    size,
                    product_status: 'active',
                });
                product.save().then(() => {
                }).catch(() => {
                    res.redirect('/500');
                });
                res.redirect('/admin/home/products');
            } else {
                res.redirect('/500');
            }
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const productActivate = (req, res) => {
    try {
        // eslint-disable-next-line no-unused-vars
        const activateProduct = model.Product.findByIdAndUpdate({ _id: req.params.id }, { product_status: 'active' })
            .then(() => {
                res.redirect('/admin/home/products');
            }).catch(() => {
                res.redirect('/500');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const productDeactivate = (req, res) => {
    try {
        model.Product.findByIdAndUpdate({ _id: req.params.id }, { product_status: 'deactivated' })
            .then(() => {
                res.redirect('/admin/home/products');
            }).catch(() => {
                res.redirect('/500');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const addSize = async (req, res) => {
    try {
        const { size, product } = req.body;
        await model.Product.findByIdAndUpdate({ _id: product }, { $push: { size } });
        res.send('success');
    } catch (error) {
        res.redirect('/500');
    }
};

const productDelete = (req, res) => {
    try {
        model.Product.findOneAndDelete({ _id: req.params.id })
            .then(() => {
                const filePath = `./public/images/${req.params.img}`;
                fs.unlink(filePath, (err) => {
                    if (err) throw err;
                });
                res.redirect('/admin/home/products');
            }).catch(() => {
                res.redirect('/500');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const productEdit = (req, res) => {
    try {
        const { id } = req.params;
        model.Product.findOne({ _id: id }).then((doc) => {
            model.SubCategory.find().then((docs) => {
                model.Category.find().then((result) => {
                    res.render('admin/productEdit', { doc, main: result, sub: docs });
                });
            }).catch(() => {
                res.redirect('/500');
            });
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const productEditPost = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            prodcutName,
            price,
            stock,
            color,
            size,
            brand,
            ...cate
        } = req.body;
        const categories = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const key in cate) {
            if (key) { categories.push(cate[key]); }
        }
        if (req.files) {
            const { image } = req.files;
            const fileName = req.params.img;
            // eslint-disable-next-line no-unused-vars
            await image.mv(`./public/images/${fileName}`, (err, done) => {
                if (!err) {
                    model.Product.findByIdAndUpdate(
                        { _id: id },
                        {
                            product_name: prodcutName,
                            price: Number(price),
                            stock: Number(stock),
                            category: categories,
                            brand,
                            color,
                            size,
                        },
                    ).then(() => {
                        res.redirect('/admin/home/products');
                    });
                }
            });
        } else {
            model.Product.findByIdAndUpdate(
                { _id: id },
                {
                    product_name: prodcutName,
                    price,
                    stock,
                    category: categories,
                    brand,
                    color,
                    size,
                },
            ).then(() => {
                res.redirect('/admin/home/products');
            });
        }
    } catch (error) {
        res.redirect('/500');
    }
};

// category
const categoryRender = (req, res) => {
    try {
        model.Category.find().then((docs) => {
            res.render('admin/adminCategory', { allData: docs });
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const categoryAdd = (req, res) => {
    res.render('admin/adminAddCategory');
};

const categoryAddPost = (req, res) => {
    try {
        const name = req.body.categoryName;
        const { Category } = model;
        const category = new Category({
            category_name: name,
        });
        category.save().then(() => {
            res.redirect('/admin/home/category');
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const editCategoryRender = (req, res) => {
    try {
        const { id } = req.params;
        model.Category.findOne({ _id: id }).then((result) => {
            res.render('admin/categoryEdit', { doc: result });
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const editCategoryPost = (req, res) => {
    try {
        const { id } = req.params;
        const name = req.body.categoryName;
        model.Category.findByIdAndUpdate({ _id: id }, { category_name: name })
            // eslint-disable-next-line no-unused-vars
            .then((doc) => {
                res.redirect('/admin/home/category');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const subcategoryRender = (req, res) => {
    try {
        model.SubCategory.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category_id',
                    foreignField: '_id',
                    as: 'cate',
                },
            },
            { $unwind: '$cate' },
        ]).then((docs) => {
            res.render('admin/adminSubCategory', { allData: docs });
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const addSubcategoryRender = (req, res) => {
    try {
        model.Category.find().then((docs) => {
            res.render('admin/adminAddSubcategory', { allData: docs });
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const addSubcategpryPost = (req, res) => {
    try {
        const cateid = req.body.category;
        const subcate = req.body.subcategoryName;
        const { SubCategory } = model;
        const subcategory = new SubCategory({
            category_id: cateid,
            sub_category_name: subcate,
        });
        subcategory.save().then(() => {
            res.redirect('/admin/home/subcategory');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const editSubcategoryRender = (req, res) => {
    try {
        const { id } = req.params;
        model.Category.find().then((docs) => {
            model.SubCategory.findOne({ _id: id }).then((result) => {
                res.render('admin/subcategoryEdit', { allCategory: docs, subcategory: result });
            });
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const editSubcategoryPost = (req, res) => {
    try {
        const { id } = req.params;
        const cate = req.body.category;
        const subname = req.body.subcategoryName;
        model.SubCategory.findByIdAndUpdate(
            { _id: id },
            { sub_category_name: subname, category_id: cate },
        )
            // eslint-disable-next-line no-unused-vars
            .then((doc) => {
                res.redirect('/admin/home/subcategory');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

// Order

const orderRender = (req, res) => {
    try {
        model.Order.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.product_id',
                    foreignField: '_id',
                    as: 'product',
                },
            },
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
                    as: 'userAddress',
                },
            },
            { $sort: { createdAt: -1 } },
        ]).then((result) => {
            res.render('admin/adminOrders.ejs', { allData: result });
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const changeOrderStatus = (req, res) => {
    try {
        const { orderID, paymentStatus, orderStatus } = req.body;
        model.Order.findByIdAndUpdate(
            { _id: orderID },
            {
                paymentStatus, orderStatus,
            },
        ).then(() => {
            res.send('success');
        }).catch(() => {
            res.redirect('/500');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const orderCompeleted = (req, res) => {
    try {
        const { orderID } = req.body;
        model.Order.findByIdAndUpdate(
            { _id: orderID },
            { orderStatus: 'Completed' },
        ).then(() => {
            res.send('done');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const orderCancel = (req, res) => {
    try {
        const { orderID } = req.body;
        model.Order.findByIdAndUpdate(
            { _id: orderID },
            { orderStatus: 'Cancelled', paymentStatus: 'Cancelled' },
        ).then(() => {
            res.send('done');
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const salesReportRender = async (req, res) => {
    try {
        const today = moment().startOf('day');
        const endtoday = moment().endOf('day');
        const monthstart = moment().startOf('month');
        const monthend = moment().endOf('month');
        const yearstart = moment().startOf('year');
        const yearend = moment().endOf('year');
        // const today = moment('09-12-2022', 'DD-MM-YYYY').startOf('day');
        // const endtoday = moment('10-12-2022', 'DD-MM-YYYY').endOf('day');
        const daliyReport = await model.Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: today.toDate(),
                        $lte: endtoday.toDate(),
                    },
                },
            },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user',
                },
            },
            {
                $project: {
                    order_id: 1,
                    user: 1,
                    paymentStatus: 1,
                    totalAmount: 1,
                    orderStatus: 1,
                },
            },
        ]);
        const monthReport = await model.Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: monthstart.toDate(),
                        $lte: monthend.toDate(),
                    },
                },
            },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user',
                },
            },
            {
                $project: {
                    order_id: 1,
                    user: 1,
                    paymentStatus: 1,
                    totalAmount: 1,
                    orderStatus: 1,
                },
            },
        ]);
        const yearReport = await model.Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: yearstart.toDate(),
                        $lte: yearend.toDate(),
                    },
                },
            },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user',
                },
            },
            {
                $project: {
                    order_id: 1,
                    user: 1,
                    paymentStatus: 1,
                    totalAmount: 1,
                    orderStatus: 1,
                },
            },
        ]);
        res.render('admin/salesReport', { today: daliyReport, month: monthReport, year: yearReport });
    } catch (error) {
        res.redirect('/500');
    }
};

const salesCustomDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const start = moment(startDate, 'YYYY-MM-DD').startOf('day');
        const end = moment(endDate, 'YYYY-MM-DD').endOf('day');

        const cusReport = await model.Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: start.toDate(),
                        $lte: end.toDate(),
                    },
                },
            },
            {
                $lookup:
                {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    as: 'user',
                },
            },
            {
                $project: {
                    order_id: 1,
                    user: 1,
                    paymentStatus: 1,
                    totalAmount: 1,
                    orderStatus: 1,
                },
            },
        ]);
        res.json(cusReport);
    } catch (error) {
        res.redirect('/500');
    }
};

const bannerRender = async (req, res) => {
    try {
        const banner = await model.Banner.find();
        res.render('admin/adminBanner', { allData: banner });
    } catch (error) {
        res.redirect('/500');
    }
};

const addBannerRender = (req, res) => {
    res.render('admin/adminAddBanner');
};

const addBannerPost = async (req, res) => {
    try {
        const image = req.files.Image;
        // eslint-disable-next-line prefer-destructuring
        const Banner = model.Banner;
        // eslint-disable-next-line prefer-destructuring
        const {
            Name,
        } = req.body;
        const fileName = `${Date.now()}.jpg`;
        // eslint-disable-next-line prefer-template, no-unused-vars
        await image.mv('./public/images/' + fileName, (err, done) => {
            if (!err) {
                const banner = new Banner({
                    image: fileName,
                    name: Name,
                });
                banner.save().then(() => {
                }).catch(() => {
                    res.redirect('/500');
                });
                res.redirect('/admin/home/banner');
            } else {
                res.redirect('/500');
            }
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const deleteBanner = (req, res) => {
    try {
        model.Banner.findOneAndDelete({ _id: req.params.id })
            .then((result) => {
                const filePath = `./public/images/${result.image}`;
                fs.unlink(filePath, (err) => {
                    if (err) throw err;
                });
                res.redirect('/admin/home/banner');
            }).catch(() => {
                res.redirect('/500');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const couponRender = async (req, res) => {
    try {
        const coupons = await model.Coupon.find();
        res.render('admin/adminCoupon', { allData: coupons });
    } catch (error) {
        res.redirect('/500');
    }
};

const addCouponRender = (req, res) => {
    try {
        res.render('admin/addCoupon', { message: req.flash('message') });
    } catch (error) {
        res.redirect('/500');
    }
};

const addCouponPost = async (req, res) => {
    try {
        const { code, offer, amount } = req.body;
        const already = await model.Coupon.find({ code });
        if (already.length > 0) {
            req.flash('message', ['Code already exist']);
            res.redirect('admin/home/coupon/add');
        } else {
            // eslint-disable-next-line prefer-destructuring
            const Coupon = model.Coupon;
            const coupon = new Coupon({
                coupon_code: code,
                offer,
                max_amount: amount,
            });
            await coupon.save();
            res.redirect('/admin/home/coupon');
        }
    } catch (error) {
        res.redirect('/500');
    }
};

const deactivateCoupon = (req, res) => {
    try {
        model.Coupon.findByIdAndUpdate({ _id: req.params.id }, { coupon_status: 'Deactivated' })
            .then(() => {
                res.redirect('/admin/home/coupon');
            }).catch(() => {
                res.redirect('/500');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const activateCoupon = (req, res) => {
    try {
        model.Coupon.findByIdAndUpdate({ _id: req.params.id }, { coupon_status: 'Active' })
            .then(() => {
                res.redirect('/admin/home/coupon');
            }).catch(() => {
                res.redirect('/500');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const deleteCoupon = (req, res) => {
    try {
        model.Coupon.findOneAndDelete({ _id: req.params.id })
            .then(() => {
                res.redirect('/admin/home/coupon');
            }).catch(() => {
                res.redirect('/500');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const editCouponRender = (req, res) => {
    try {
        const { id } = req.params;
        model.Coupon.findOne({ _id: id }).then((doc) => {
            res.render('admin/editCoupon', { data: doc });
        });
    } catch (error) {
        res.redirect('/500');
    }
};

const editCouponPost = async (req, res) => {
    try {
        const {
            id,
            code,
            offer,
            amount,
        } = req.body;
        await model.Coupon.findByIdAndUpdate(
            { _id: id },
            {
                coupon_code: code,
                offer,
                max_amount: amount,
            },
        );
        res.redirect('/admin/home/coupon');
    } catch (error) {
        res.redirect('/500');
    }
};

module.exports = {
    // admin
    adminRender,
    // product
    adminProductsRender,
    adminUsersRender,
    adminBlockUser,
    adminUnblockUser,
    adminDeleteUser,
    adminAddProductRender,
    adminAddProductpost,
    productDeactivate,
    productActivate,
    productDelete,
    productEdit,
    productEditPost,
    addSize,
    categoryRender,
    categoryAdd,
    categoryAddPost,
    subcategoryRender,
    addSubcategoryRender,
    addSubcategpryPost,
    editCategoryRender,
    editCategoryPost,
    editSubcategoryRender,
    editSubcategoryPost,
    // orders
    orderRender,
    changeOrderStatus,
    orderCompeleted,
    orderCancel,
    // sales report
    salesReportRender,
    salesCustomDate,
    // banner
    bannerRender,
    addBannerRender,
    addBannerPost,
    deleteBanner,
    // coupon
    couponRender,
    addCouponRender,
    addCouponPost,
    deactivateCoupon,
    activateCoupon,
    deleteCoupon,
    editCouponRender,
    editCouponPost,
};
