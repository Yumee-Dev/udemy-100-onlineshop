require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    address: {
        street: String,
        postalCode: String,
        city: String
    }
});

let User = mongoose.model('User', userSchema);

function signupNewUser(email, password, fullname, address) {
    return 'Ok';
    // MongoDB doesn't work anymore
    // replace with Yandex Cloud later
    const user = new User({
        email: email,
        password: password,
        fullname: fullname,
        address: {
            street: address.street,
            postalCode: address.postalCode,
            city: address.city
        }
    });
    return user.save();
}

module.exports = signupNewUser;