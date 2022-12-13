/* eslint-disable linebreak-style */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable indent */
/* eslint-disable no-console */
let message = '';
// let otpver = 0;
const client = require('twilio')('AC07a1dceecd2e171cd1f738dce7f9098a', '289c7d4874a474d43994933820e9bcd0');
const uuid = require('uuid');
const model = require('../models/UsersModel');

const signupRender = (req, res) => {
    res.render('Signup', { message });
    message = '';
};

const otpRender = (req, res) => {
    res.render('otp');
};

const otpPost = async (req, res) => {
    const phone = req.body.phone;
    const otpdata = await model.OTP.findOne({ otp_id: phone });
    const otpver = otpdata.otp;
    if (otpver === Number(req.body.otp)) {
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
                } else {
                    console.log('error inserting addess');
                }
            }).catch((error) => {
                console.log(error);
            });
        }).catch((error) => {
            console.log(error);
        });
    } else {
        message = 'invalid OTP';
        res.redirect('/signup');
    }
};

const signupPost = async (req, res) => {
    const data = { ...req.body };
    const email = data.email;
    const phone = Number(data.phone);
    // eslint-disable-next-line no-unused-vars, object-shorthand
    const alredyCheck = model.Users.find({ $or: [{ email: email }, { phone: phone }] })
        .then((result) => {
            if (result[0]) {
                message = 'Already registered email or phone';
                res.redirect('/signup');
            } else {
                // eslint-disable-next-line no-unused-vars
                const usernameCheck = model.Users.find({ username: data.Username })
                    .then((results) => {
                        if (results[0]) {
                            message = 'Username unavailable';
                            res.redirect('/signup');
                            message = '';
                        } else {
                            const otpver = Math.floor(100000 + Math.random() * 900000);
                            const OTP = model.OTP;
                            const otp = new OTP({
                                otp: otpver,
                                otp_id: data.phone,
                            });
                            otp.save().then(() => {
                                const tonumber = `+91${data.phone}`;
                                sendOTP(tonumber, otpver);
                                res.render('otp', { data });
                            });
                        }
                    });
            }
        }).catch((error) => {
            console.log(error);
        });
};

// eslint-disable-next-line no-unused-vars
function sendOTP(number, otp) {
    client.messages
        .create({
            to: number,
            from: '+19403604865',
            body: `your otp is: ${otp}`,
        })
        .then((messages) => console.log(`Message SID ${messages.sid}`))
        .catch((error) => console.error(error));
}
module.exports = {
    signupRender,
    otpRender,
    signupPost,
    otpPost,
};
