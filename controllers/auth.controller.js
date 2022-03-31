const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const { userCredentialsAreValid } = require('../util/fields-validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res) {
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            email: '',
            confirmEmail: '',
            password: '',
            fullname: '',
            street: '',
            postal: '',
            city: ''
        };
    }

    res.render('customer/auth/signup', { inputData: sessionData });
}

async function signup(req, res, next) {
    const enteredData = {
        email: req.body.email,
        confirmEmail: req.body['confirm-email'],
        password: req.body.password,
        fullname: req.body.fullname,
        street: req.body.street,
        postal: req.body.postal,
        city: req.body.city
    };

    if (!userCredentialsAreValid(req.body.email, req.body['confirm-email'], req.body.password, req.body.street, req.body.postal, req.body.city)) {
        sessionFlash.flashDataToSession(req, {
            errorMessage: 'Please check your input',
            ...enteredData
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
            sessionFlash.flashDataToSession(req, {
                errorMessage: 'User exists already! Try logging in instead!',
                ...enteredData
            }, () => res.redirect('/signup'));
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
    let sessionData = sessionFlash.getSessionData(req);

    if (!sessionData) {
        sessionData = {
            email: '',
            password: ''
        };
    }

    res.render('customer/auth/login', { inputData: sessionData });
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
        sessionFlash.flashDataToSession(req, {
            errorMessage: 'Invalid credentials! Please check your e-mail and password!',
            email: user.email,
            password: user.password
        }, () => res.redirect('/login'));
        return;
    }

    const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);

    if (!passwordIsCorrect) {
        sessionFlash.flashDataToSession(req, {
            errorMessage: 'Invalid credentials! Please check your e-mail and password!',
            email: user.email,
            password: user.password
        }, () => res.redirect('/login'));
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