require('dotenv').config();

const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const { Schema } = mongoose;

// USED FOR TESTING CONNECTION
// const personSchema = new Schema({
//     name: { type: String, required: true },
//     age: { type: Number, min: 0, max: 200 },
//     favoriteFoods: [String]
// });

// let Person = mongoose.model('Person', personSchema);

// const person = new Person({
//     name: 'Yumee',
//     age: 0,
//     favoriteFoods: ['background radiation', 'quark-gluon plasma']
// });
// person.save();

const authRoutes = require('./routes/auth');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(authRoutes);

app.get('/', (req, res) => {
    res.redirect('cart');
});

app.get('/cart', (req, res) => {
    res.render('customer/cart');
});

app.get('/orders', (req, res) => {
    res.render('orders');
});

app.get('/401', (req, res) => {
    res.status(401).render('401');
});

app.get('/404', (req, res) => {
    res.status(404).render('404');
});

app.get('/500', (req, res) => {
    res.status(500).render('500');
});

app.get('/*', (req, res) => {
    res.redirect('404');
});

console.log('Server is running...');

app.listen(3000);