/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable no-console */
const express = require('express');
const path = require('path');
// eslint-disable-next-line no-unused-vars
const fs = require('fs');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const fileupload = require('express-fileupload');
const mongoose = require('mongoose');

const app = express();

mongoose.connect(
    'mongodb://localhost:27017/FootDotCom',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('successfully connected');
        }
    },
);
app.use(
    sessions({
        secret: 'secKey98214#29o3',
        saveUninitialized: true,
        resave: false,
    }),
);
app.use(cookieParser());
app.use(fileupload());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

const signupRoute = require('./routes/SignupRouter');
const loginRoute = require('./routes/LoginRouter');
const adminRoute = require('./routes/AdminRouter');
const userRoute = require('./routes/UserRouter');

app.use('/', userRoute);
app.use('/signup', signupRoute);
app.use('/login', loginRoute);
app.use('/admin', adminRoute);

app.listen(7000, () => {
    console.log('server running on port 7000');
});
