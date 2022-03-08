const fs = require('fs');
const path = require('path');

const express = require('express');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/401', (req, res) => {
    res.status(401).render('401');
});

app.get('/404', (req, res) => {
    res.status(404).render('404');
});

app.get('/500', (req, res) => {
    res.status(500).render('500');
});

console.log('Server is running...');

app.listen(3000);