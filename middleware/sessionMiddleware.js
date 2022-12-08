/* eslint-disable linebreak-style */
/* eslint-disable indent */
const userSession = (req, res, next) => {
    if (req.session.userID && req.session.accountType === 'user') {
        next();
    } else {
        res.redirect('/404');
    }
};

const adminSession = (req, res, next) => {
    if (req.session.userID && req.session.accountType === 'admin') {
        next();
    } else {
        res.redirect('/404');
    }
};

module.exports = {
    userSession,
    adminSession,
};
