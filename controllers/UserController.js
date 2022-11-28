/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable indent */
const model = require('../models/UsersModel');

const landingPageRender = (req, res) => {
    if (!req.session.userID) {
        model.Product.find().limit(7).then((result) => {
            console.log(result);
            res.render('Landingpage', { allData: result });
        }).catch((err) => {
            console.log(err);
        });
    } else {
        res.redirect('/login');
    }
};

const userHomeRender = (req, res) => {
    // const sessions = req.session;
    // if (sessions.userId && sessions.accountType === 'user') {
    model.Product.find({ product_status: 'active' }).then((result) => {
        res.render('user/UserHome', { allData: result });
    }).catch((error) => {
        console.log(error);
    });
    // }
};

const userProductView = (req, res) => {
    const { id } = req.params;
    // console.log(req.params);
    model.Product.aggregate([{ $match: { _id: id } },
    {
        $lookup: {
            from: 'categories',
            localField: 'category_id',
            foreignField: 'category_id',
            as: 'product',
        },
    },
    { $unwind: '$product' },
    ]).then((result) => {
        console.log(result);
        res.render('user/UserProductView', { allData: result });
    }).catch((err) => {
        console.log(err);
    });
};

module.exports = {
    landingPageRender,
    userHomeRender,
    userProductView,
};
