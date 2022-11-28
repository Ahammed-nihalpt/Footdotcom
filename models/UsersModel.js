/* eslint-disable linebreak-style */
/* eslint-disable indent */
const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    account_type: {
        type: String,
        required: true,
    },
    user_status: {
        type: String,
        required: true,
    },
});

const addressSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    pincode: {
        type: Number,
        required: true,
    },
});

const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    account_type: {
        type: String,
        required: true,
    },
});

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_img: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    stock: {
        type: String,
        required: true,
    },
    category_id: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    size: [String],
    product_status: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const CategorySchema = new Schema({
    category_id: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    occasion: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
});

const Users = mongoose.model('User', userSchema);
const Address = mongoose.model('Address', addressSchema);
const Admin = mongoose.model('admin', adminSchema);
const Product = mongoose.model('product', productSchema);
const Category = mongoose.model('category', CategorySchema);

module.exports = {
    Users,
    Address,
    Admin,
    Product,
    Category,
};
