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
        type: String
    },
    paymentMethods: [{
        method:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PaymentMethod'
        },
        number: {
            type: String
        }
    }],
    isActive: {
        type: Boolean,
        default: false
    },
    isConfirmed: {
        type: Boolean,
        default: false
    },
    passwordResetToken: {
        type: String
    }
},{timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;