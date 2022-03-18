const express = require('express');

const router = express.Router();

router.get('/signup', (req, res) => {
    console.log();
    res.render('signup');
});

router.post('/signup', (req, res) => {
    res.redirect('404');
});

router.get('/login', (req, res) => {
    console.log();
    res.render('login');
});

router.post('/login', (req, res) => {
    res.redirect('404');
});

module.exports = router;