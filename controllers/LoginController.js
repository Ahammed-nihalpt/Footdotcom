/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable indent */
const model = require('../models/UsersModel');

const loginRender = (req, res) => {
    try {
        // eslint-disable-next-line prefer-destructuring
        const session = req.session;
        if (session.userID) {
            if (session.accountType === 'admin') {
                res.redirect('/admin/home');
            } else {
                res.redirect('/user/home');
            }
        } else {
            res.render('Login', { message: req.flash('message') });
        }
    } catch (error) {
        res.redirect('/500');
    }
};

const loginPost = (req, res) => {
    try {
        const { username, password } = { ...req.body };
        // eslint-disable-next-line object-shorthand, prefer-destructuring
        model.Users.findOne({ $and: [{ username: username }, { password: password }] })
            .then((result) => {
                // eslint-disable-next-line prefer-destructuring
                const session = req.session;
                if (result) {
                    if (result.user_status === 'blocked') {
                        req.flash('message', ['user is Blocked']);
                        res.redirect('/login');
                    } else {
                        session.userID = result.user_id;
                        session.accountType = result.account_type;
                        session.userName = result.name;
                        res.redirect('/user/home');
                    }
                } else {
                    // eslint-disable-next-line object-shorthand
                    model.Admin.findOne({ $and: [{ username: username }, { password: password }] })
                        .then((results) => {
                            if (results) {
                                session.userID = results.username;
                                session.accountType = results.account_type;
                                res.redirect('/admin/home');
                            } else {
                                req.flash('message', ['user not found']);
                                res.redirect('/login');
                            }
                        });
                    if (
                        username === process.env.ADMIN_UNAME
                        && password === process.env.ADMIN_PASS) {
                        session.userID = username;
                        session.accountType = 'admin';
                        res.redirect('/admin/home');
                    }
                }
            }).catch(() => {
                res.redirect('/500');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

const logout = (req, res) => {
    try {
        // eslint-disable-next-line prefer-destructuring
        const session = req.session;
        session.destroy();
        res.redirect('/');
    } catch (error) {
        res.redirect('/500');
    }
};

module.exports = {
    loginRender,
    loginPost,
    logout,
};
