/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable indent */
const fs = require('fs');
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
                from: 'categories',
                localField: 'category_id',
                foreignField: 'category_id',
                as: 'product',
            },
        },
        { $unwind: '$product' },
    ])
        .then((rsult) => {
            // res.render('admin/adminAddProducts');
            res.render('admin/adminProducts', { allData: rsult });
        }).catch((error) => {
            console.log(error);
        });
};

const adminUsersRender = (req, res) => {
    // eslint-disable-next-line prefer-destructuring
    // const session = req.session;
    // if (session.userID && session.accountType === 'admin') {
    // eslint-disable-next-line no-unused-vars
    const Allusers = model.Users.find({ account_type: 'user' })
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
        .then((result) => {
            console.log(result);
            res.redirect('/admin/home/users');
        }).catch((err) => {
            console.log(err);
        });
};

const adminBlockUser = (req, res) => {
    // eslint-disable-next-line no-unused-vars
    const blockUser = model.Users.findByIdAndUpdate({ _id: req.params.id }, { user_status: 'blocked' })
        .then((result) => {
            console.log(result);
            res.redirect('/admin/home/users');
        }).catch((err) => {
            console.log(err);
        });
};

const adminDeleteUser = (req, res) => {
    // eslint-disable-next-line no-unused-vars
    const deleteUser = model.Users.findByIdAndDelete({ _id: req.params.id }).then((result) => {
        console.log(result);
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
    res.render('admin/adminAddProducts');
};

const adminAddProductpost = async (req, res) => {
    const image = req.files.prodcutImage;
    const catid = Date.now();
    // eslint-disable-next-line prefer-destructuring
    const Product = model.Product;
    // eslint-disable-next-line prefer-destructuring
    const Category = model.Category;
    const {
        prodcutName,
        price,
        stock,
        color,
        size,
        brand,
        type,
        occasion,
        gender,
    } = { ...req.body };
    // eslint-disable-next-line comma-dangle, prefer-template, no-unused-vars
    const fileName = Date.now() + '.jpg';
    // eslint-disable-next-line prefer-template, no-unused-vars
    await image.mv('./public/images/' + fileName, (err, done) => {
        if (!err) {
            const category = new Category({
                category_id: catid,
                type,
                occasion,
                gender,
            });
            category.save().then((data) => {
                if (data) {
                    const product = new Product({
                        product_img: fileName,
                        product_name: prodcutName,
                        price,
                        stock,
                        // eslint-disable-next-line no-underscore-dangle
                        category_id: catid,
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
                } else {
                    console.log(data);
                }
            }).catch((errors) => {
                console.log(errors);
            });

            res.redirect('/admin/home/products');
        } else {
            console.log(err);
        }
    });
    // upload.single('prodcutImage');
    // res.send('done');
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
    console.log(req.params.id);
    // eslint-disable-next-line no-unused-vars
    const deletecategory = model.Category.findOneAndDelete({ category_id: req.params.id })
        .then((result) => {
            console.log(result);
            // eslint-disable-next-line no-unused-vars
            const deleteproduct = model.Product.findOneAndDelete({ category_id: req.params.id })
                // eslint-disable-next-line no-unused-vars
                .then((results) => {
                    console.log(result);
                    const filePath = `./public/images/${req.params.img}`;
                    fs.unlink(filePath, (err) => {
                        if (err) throw err;
                        console.log('path/file.txt was deleted');
                    });
                    res.redirect('/admin/home/products');
                }).catch((err) => {
                    console.log(err);
                });
        }).catch((error) => {
            console.log(error);
        });
};

module.exports = {
    adminRender,
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
};
