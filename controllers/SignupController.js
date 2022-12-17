/* eslint-disable linebreak-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable indent */
/* eslint-disable no-console */
const client = require('twilio')(process.env.TWILIO_ACCOUNTSID, process.env.TWILIO_TOKEN);
const uuid = require('uuid');
const model = require('../models/UsersModel');

const signupRender = (req, res) => {
    try {
        res.render('Signup', { message: req.flash('message') });
    } catch (error) {
        res.redirect('/500');
    }
};

const otpRender = (req, res) => {
    res.render('otp');
};

const otpPost = async (req, res) => {
    try {
        const phone = req.body.phone;
        const otpdata = await model.OTP.findOne({ otp_id: phone });
        const otpver = otpdata.otp;
        // eslint-disable-next-line eqeqeq
        if (otpver == Number(req.body.otp)) {
            // eslint-disable-next-line prefer-destructuring
            const Users = model.Users;
            const Address = model.Address;
            const name = req.body.name;
            const username = req.body.Username;
            const address = req.body.address;
            const state = req.body.state;
            const city = req.body.city;
            const pincode = req.body.pincode;
            const email = req.body.email.trim();
            const password = req.body.password;
            const uid = uuid.v4();
            const user = new Users({
                user_id: uid,
                name,
                username,
                email,
                phone,
                password,
                account_type: 'user',
                user_status: 'active',
            });
            user.save().then((result) => {
                const addressobj = new Address({
                    // eslint-disable-next-line no-underscore-dangle
                    user_id: result.user_id,
                    address,
                    state,
                    city,
                    pincode,
                });
                addressobj.save().then((results) => {
                    if (results) {
                        model.OTP.findOneAndDelete({ otp_id: phone }).then(() => {
                            res.render('success');
                        });
                    }
                }).catch(() => {
                    res.redirect('/500');
                });
            }).catch(() => {
                res.redirect('/500');
            });
        } else {
            model.OTP.findOneAndDelete({ otp_id: phone }).then(() => {
                req.flash('message', ['invalid OTP']);
                res.redirect('/signup');
            });
        }
    } catch (error) {
        res.redirect('/500');
    }
};

const signupPost = async (req, res) => {
    try {
        const data = { ...req.body };
        const email = data.email;
        const phone = Number(data.phone);
        // eslint-disable-next-line no-unused-vars, object-shorthand
        const alredyCheck = model.Users.find({ $or: [{ email: email }, { phone: phone }] })
            .then((result) => {
                if (result[0]) {
                    req.flash('message', ['Already registered email or phone']);
                    res.redirect('/signup');
                } else {
                    // eslint-disable-next-line no-unused-vars
                    const usernameCheck = model.Users.find({ username: data.Username })
                        .then((results) => {
                            if (results[0]) {
                                req.flash('message', ['Username unavailable']);
                                res.redirect('/signup');
                            } else {
                                const otpver = Math.floor(100000 + Math.random() * 900000);
                                const OTP = model.OTP;
                                const otp = new OTP({
                                    otp: otpver,
                                    otp_id: data.phone,
                                });
                                otp.save().then(() => {
                                    const tonumber = `+91${data.phone}`;
                                    client.messages
                                        .create({
                                            to: tonumber,
                                            from: '+19403604865',
                                            body: `your otp is: ${otpver}`,
                                        }).then(() => {
                                            res.render('otp', { data });
                                        }).catch(() => {
                                            req.flash('message', ['The phone number is not registered in twilio']);
                                            res.redirect('/signup');
                                        });
                                });
                            }
                        });
                }
            }).catch(() => {
                res.redirect('/500');
            });
    } catch (error) {
        res.redirect('/500');
    }
};

module.exports = {
    signupRender,
    otpRender,
    signupPost,
    otpPost,
};
