/* eslint-disable linebreak-style */
/* eslint-disable indent */
const Razorpay = require('razorpay');

const instance = new Razorpay({
    key_id: process.env.RAZOR_KEY_ID,
    key_secret: process.env.RAZOR_KEY_SECRET,
});

module.exports = instance;
