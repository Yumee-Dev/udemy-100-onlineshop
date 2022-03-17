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
        postalcode: String,
        city: String
    }
});

let User = mongoose.model('User', userSchema);

const user = new User({
    email: 'test@test.com',
    password: 'DFSjsfi23dsbH',
    fullname: 'Max Damage',
    address: {
        street: 'Teststreet',
        postalcode: '7920D',
        city: 'Heavenburg'
    }
});
user.save();