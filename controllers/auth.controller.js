const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const { userCredentialsAreValid } = require('../util/fields-validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res) {
    res.render('customer/auth/signup');
}

async function signup(req, res, next) {
    const enteredData = {}; // 9:51 Flashing errors

    if (!userCredentialsAreValid(req.body.email, req.body['confirm-email'], req.body.password, req.body.street, req.body.postal, req.body.city)) {
        sessionFlash.flashDataToSession(req, {
            errorMessage: 'Please check your input'
        }, () => res.redirect('/signup'));
        return;
    }

    const user = new User(
        req.body.email,
        req.body.password,
        req.body.fullname,
        req.body.street,
        req.body.postal,
        req.body.city
    );


    // manual error handling is necessary
    // because error handling middleware doesn't catch async errors
    try {
        const existsAlready = await user.existsAlready();

        if (existsAlready) {
            res.redirect('/signup');
            return;
        }

        await user.signup();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/login');
}

function getLogin(req, res) {
    res.render('customer/auth/login');
}

async function login(req, res, next) {
    const user = new User(req.body.email, req.body.password);
    let existingUser;
    try {
        existingUser = await user.getUserWithSameEmail();
    } catch (error) {
        next(error);
        return;
    }

    if (!existingUser) {
        res.redirect('/login');
        return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);

    if (!passwordIsCorrect) {
        res.redirect('/login');
        return;
    }

    authUtil.createUserSession(req, existingUser, function () {
        res.redirect('/');
    });
}

function logout(req, res) {
    authUtil.destroyUserAuthSession(req);
    res.redirect('/');
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,
    login: login,
    logout: logout
};