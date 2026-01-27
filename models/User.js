const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    telephone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic:{
        type: String,
        default: ''
    },
    paymentMethods: [{
        method:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PaymentMethod'
        },
        number: {
            type: String
        },
    }],
    isActive: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    accountConfirmationToken: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: 'buyer'
    }
},{timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;