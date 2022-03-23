const express = require('express');
const signupNewUser = require('../models/user');

const authController = require('../controllers/auth-controller');

const router = express.Router();

router.get('/signup', authController.getSignup);
router.get('/login', authController.getLogin);

router.get('/signup', (req, res) => {
    console.log();
    res.render('signup');
});

router.post('/signup', (req, res) => {
    if (req.body.email === req.body['confirm-email'] &&
        req.body.password &&
        req.body.password.trim().length > 0) {
        res.json({
            result: signupNewUser(
                req.body.email,
                req.body.password,
                req.body.fullname,
                { street: req.body.street, postalCode: req.body['postal-code'], city: req.body.city }
            )
        });
        return;
    }
    res.redirect('500');
});

router.get('/login', (req, res) => {
    console.log();
    res.render('login');
});

router.post('/login', (req, res) => {
    res.redirect('404');
});

module.exports = router;