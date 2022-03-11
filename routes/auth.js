const express = require('express');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', (req, res) => {
    res.render('404');
});

module.exports = router;