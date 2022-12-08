/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable indent */
const fs = require('fs');
// const uuid = require('uuid');
const model = require('../models/UsersModel');

const adminRender = (req, res) => {
    // eslint-disable-next-line prefer-destructuring
    const session = req.session;
    let count = 0;
    if (session.userID && session.accountType === 'admin') {
        // eslint-disable-next-line no-unused-vars
        const userCount = model.Users.countDocuments({}).then((result) => {
            count = result;
            res.render('admin/adminHome', { count });
        });
    } else {
        res.send('404');
    }
};

const adminProductsRender = (req, res) => {
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
            // console.log(rsult);
            model.Category.find().then((doc) => {
                res.render('admin/adminProducts', { allData: rsult, category: doc });
            });
            // res.render('admin/adminAddProducts');
        }).catch((error) => {
            console.log(error);
        });
};

const adminUsersRender = (req, res) => {
    model.Users.find({ account_type: 'user' })
        .then((result) => {
            res.render('admin/adminUsers', { allData: result });
        })
        .catch((err) => {
            console.log(err);
        });
};

const adminUnblockUser = (req, res) => {
    // eslint-disable-next-line no-unused-vars
    const blockUser = model.Users.findByIdAndUpdate({ _id: req.params.id }, { user_status: 'active' })
        .then(() => {
            // console.log(result);
            res.redirect('/admin/home/users');
        }).catch((err) => {
            console.log(err);
        });
};

const adminBlockUser = (req, res) => {
    // eslint-disable-next-line no-unused-vars
    const blockUser = model.Users.findByIdAndUpdate({ _id: req.params.id }, { user_status: 'blocked' })
        .then(() => {
            // console.log(result);
            res.redirect('/admin/home/users');
        }).catch((err) => {
            console.log(err);
        });
};

const adminDeleteUser = (req, res) => {
    // eslint-disable-next-line no-unused-vars
    const deleteUser = model.Users.findByIdAndDelete({ _id: req.params.id }).then((result) => {
        // console.log(result);
        // eslint-disable-next-line no-unused-vars
        const deleteUserAdd = model.Address.findOneAndDelete({ user_id: req.params.id })
            // eslint-disable-next-line no-unused-vars
            .then((results) => {
                console.log(result);
                res.redirect('/admin/home/users');
            }).catch((err) => {
                console.log(err);
            });
    }).catch((error) => {
        console.log(error);
    });
};

const adminAddProductRender = (req, res) => {
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
        console.log(docs);
        model.Category.find().then((result) => {
            console.log(result);
            res.render('admin/adminAddProducts', { sub: docs, main: result });
        });
    }).catch((e) => {
        console.log(e);
    });
};

const adminAddProductpost = async (req, res) => {
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
            product.save().then((result) => {
                console.log(result);
            }).catch((error) => {
                console.log(error);
            });
            res.redirect('/admin/home/products');
        } else {
            console.log(err);
        }
    });
};

const productActivate = (req, res) => {
    // eslint-disable-next-line no-unused-vars
    const activateProduct = model.Product.findByIdAndUpdate({ _id: req.params.id }, { product_status: 'active' })
        .then((result) => {
            console.log(result);
            res.redirect('/admin/home/products');
        }).catch((err) => {
            console.log(err);
        });
};

const productDeactivate = (req, res) => {
    // eslint-disable-next-line no-unused-vars
    const deactivateProduct = model.Product.findByIdAndUpdate({ _id: req.params.id }, { product_status: 'deactivated' })
        .then((result) => {
            console.log(result);
            res.redirect('/admin/home/products');
        }).catch((err) => {
            console.log(err);
        });
};

const productDelete = (req, res) => {
    // console.log(req.params.id);
    // eslint-disable-next-line no-unused-vars
    // eslint-disable-next-line no-unused-vars
    const deleteproduct = model.Product.findOneAndDelete({ _id: req.params.id })
        // eslint-disable-next-line no-unused-vars
        .then((result) => {
            const filePath = `./public/images/${req.params.img}`;
            fs.unlink(filePath, (err) => {
                if (err) throw err;
                console.log('path/file.txt was deleted');
            });
            res.redirect('/admin/home/products');
        }).catch((err) => {
            console.log(err);
        });
};

const productEdit = (req, res) => {
    const { id } = req.params;
    model.Product.findOne({ _id: id }).then((doc) => {
        model.SubCategory.find().then((docs) => {
            console.log(docs);
            model.Category.find().then((result) => {
                console.log(result);
                res.render('admin/productEdit', { doc, main: result, sub: docs });
            });
        }).catch((e) => {
            console.log(e);
        });
    });
};

const productEditPost = async (req, res) => {
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
};

// category
const categoryRender = (req, res) => {
    model.Category.find().then((docs) => {
        res.render('admin/adminCategory', { allData: docs });
    }).catch((e) => {
        console.log(e);
    });
};

const categoryAdd = (req, res) => {
    res.render('admin/adminAddCategory');
};

const categoryAddPost = (req, res) => {
    console.log(req.body);
    const name = req.body.categoryName;
    const { Category } = model;
    const category = new Category({
        category_name: name,
    });
    // eslint-disable-next-line no-unused-vars
    category.save().then((result) => {
        res.redirect('/admin/home/category');
    }).catch((e) => {
        console.log(e);
    });
};

const editCategoryRender = (req, res) => {
    const { id } = req.params;
    model.Category.findOne({ _id: id }).then((result) => {
        // console.log(result);
        res.render('admin/categoryEdit', { doc: result });
    });
};

const editCategoryPost = (req, res) => {
    const { id } = req.params;
    const name = req.body.categoryName;
    model.Category.findByIdAndUpdate({ _id: id }, { category_name: name })
        // eslint-disable-next-line no-unused-vars
        .then((doc) => {
            res.redirect('/admin/home/category');
        });
};

const subcategoryRender = (req, res) => {
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
        // console.log(docs);
        res.render('admin/adminSubCategory', { allData: docs });
    }).catch((e) => {
        console.log(e);
    });
};

const addSubcategoryRender = (req, res) => {
    model.Category.find().then((docs) => {
        res.render('admin/adminAddSubcategory', { allData: docs });
    }).catch((e) => {
        console.log(e);
    });
};

const addSubcategpryPost = (req, res) => {
    console.log(req.body);
    const cateid = req.body.category;
    const subcate = req.body.subcategoryName;
    const { SubCategory } = model;
    const subcategory = new SubCategory({
        category_id: cateid,
        sub_category_name: subcate,
    });
    // eslint-disable-next-line no-unused-vars
    subcategory.save().then((saved) => {
        res.redirect('/admin/home/subcategory');
    });
    // res.send('lol');
};

const editSubcategoryRender = (req, res) => {
    const { id } = req.params;
    model.Category.find().then((docs) => {
        model.SubCategory.findOne({ _id: id }).then((result) => {
            // console.log(result);
            res.render('admin/subcategoryEdit', { allCategory: docs, subcategory: result });
        });
    }).catch((e) => {
        console.log(e);
    });
};

const editSubcategoryPost = (req, res) => {
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
        }).catch();
};

// Order

const orderRender = (req, res) => {
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
        console.log(result);
        res.render('admin/adminOrders.ejs', { allData: result });
        // console.log(result);
    });
};

const changeOrderStatus = (req, res) => {
    const { orderID, paymentStatus, orderStatus } = req.body;
    console.log(req.body);
    model.Order.findByIdAndUpdate(
        { _id: orderID },
        {
            paymentStatus, orderStatus,
        },
    ).then((result) => {
        console.log(result);
        res.send('helo');
    }).catch((e) => {
        console.log(e);
    });
};

const orderCompeleted = (req, res) => {
    const { orderID } = req.body;
    model.Order.findByIdAndUpdate(
        { _id: orderID },
        { orderStatus: 'Completed' },
    ).then(() => {
        res.send('done');
    });
};

const orderCancel = (req, res) => {
    const { orderID } = req.body;
    model.Order.findByIdAndUpdate(
        { _id: orderID },
        { orderStatus: 'Cancelled', paymentStatus: 'Cancelled' },
    ).then(() => {
        res.send('done');
    });
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
};
