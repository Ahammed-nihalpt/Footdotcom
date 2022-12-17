/* eslint-disable linebreak-style */
/* eslint-disable indent */
// eslint-disable-next-line import/no-import-module-exports
const mongoose = require('mongoose');

// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;
// eslint-disable-next-line no-unused-vars
const { ObjectId } = Schema;

const userSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
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
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    category: [ObjectId],
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

const cartSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    products: [
        {
            product_id: {
                type: ObjectId,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            size: {
                type: Number,
                required: true,
            },
        },
    ],
});

const CategorySchema = new Schema({
    category_name: {
        type: String,
        required: true,
    },
});

const SubCategorySchema = new Schema({
    category_id: {
        type: ObjectId,
        required: true,
    },
    sub_category_name: {
        type: String,
        required: true,
    },
});

const orderSchema = new Schema({
    order_id: {
        type: String,
        unique: true,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
    address: {
        type: ObjectId,
        required: true,
    },
    products: [
        {
            product_id: {
                type: ObjectId,
                required: true,
                ref: 'products',
            },
            quantity: {
                type: Number,
                required: true,
            },
            size: {
                type: Number,
                required: true,
            },
        },
    ],
    expectedDelivery: {
        type: String,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        default: 'Pending',
    },
    orderStatus: {
        type: String,
        default: 'Pending',
    },
    order_placed_on: {
        type: String,
        required: true,
    },

}, { timestamps: true });

const OTPSchema = new Schema({
    otp: {
        type: String,
        required: true,
    },
    otp_id: {
        type: String,
        required: true,
    },
});

const wishlistSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        product: [
            {
                productId: {
                    type: ObjectId,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    },
);

const bannerSchema = new Schema(
    {
        image: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const CouponSchema = new Schema({
    coupon_code: {
        type: String,
        required: true,
    },
    offer: {
        type: String,
        required: true,
    },
    max_amount: {
        type: String,
        required: true,
    },
    coupon_status: {
        type: String,
        default: 'Active',
    },
    used_user_id: [String],
});

const Wishlist = mongoose.model('wishlist', wishlistSchema);
const Users = mongoose.model('User', userSchema);
const Address = mongoose.model('Address', addressSchema);
const Admin = mongoose.model('admin', adminSchema);
const OTP = mongoose.model('otp', OTPSchema);
const Product = mongoose.model('product', productSchema);
const Category = mongoose.model('category', CategorySchema);
const SubCategory = mongoose.model('subcategory', SubCategorySchema);
const Cart = mongoose.model('cart', cartSchema);
const Order = mongoose.model('order', orderSchema);
const Banner = mongoose.model('banner', bannerSchema);
const Coupon = mongoose.model('coupon', CouponSchema);

module.exports = {
    Users,
    Address,
    Admin,
    Product,
    Category,
    Cart,
    Order,
    SubCategory,
    OTP,
    Wishlist,
    Banner,
    Coupon,
};
