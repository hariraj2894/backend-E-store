const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,  // Email should remain unique
    },
    password: {
        type: String,
        required: true
    },
    isadmin: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        required: true,
        unique: true
      },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    codCount: {
        type: Number,
        default: 0 // Track how many COD payments a user has made
    },
    cart: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        name: { type: String, required: true },
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
