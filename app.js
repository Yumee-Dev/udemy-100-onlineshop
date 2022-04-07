const path = require('path');

const express = require('express');
const csrf = require('csurf');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token-middleware');
const errorHandlerMiddleware = require('./middlewares/error-handler-middleware');
const checkAuthStatusMiddleware = require('./middlewares/page-access-middleware');
const protectRoutesMiddleware = require('./middlewares/auth-middleware');
const cartMiddleware = require('./middlewares/cart');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/products/assets', express.static('product-data'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(cartMiddleware);

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(authRoutes);
app.use('/cart', cartRoutes);
// we need to use protectRoutesMiddleware before accessing admin routes
// to ensure that a user is authorized and is admin
app.use(protectRoutesMiddleware);
app.use('/admin', adminRoutes);

app.use(errorHandlerMiddleware);

db.connectToDatabase()
    .then(() => {
        app.listen(3000);
    })
    .catch(error => {
        console.log('Failed to connect to the database!');
        console.log(error);
    });