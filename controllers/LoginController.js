/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable indent */
const model = require('../models/UsersModel');

let message = '';
const loginRender = (req, res) => {
    // eslint-disable-next-line prefer-destructuring
    const session = req.session;
    if (session.userID) {
        if (session.accountType === 'admin') {
            res.redirect('/admin/home');
        } else {
            res.redirect('/user/home');
        }
    } else {
        res.render('Login', { message });
        message = '';
    }
};

const loginPost = (req, res) => {
    const { username, password } = { ...req.body };
    // eslint-disable-next-line object-shorthand, prefer-destructuring
    model.Users.findOne({ $and: [{ username: username }, { password: password }] })
        .then((result) => {
            // eslint-disable-next-line prefer-destructuring
            const session = req.session;
            if (result) {
                if (result.user_status === 'blocked') {
                    message = 'user is Blocked';
                    res.redirect('/login');
                } else {
                    // console.log(result);
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
                            message = 'user not found';
                            res.redirect('/login');
                        }
                    });
            }
        }).catch((error) => {
            console.log(error);
        });
};

const logout = (req, res) => {
    // eslint-disable-next-line prefer-destructuring
    const session = req.session;
    session.destroy();
    console.log('logout');
    res.redirect('/');
};

module.exports = {
    loginRender,
    loginPost,
    logout,
};
