const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
    code: {
        type: String,   
        required: true,
        unique: true
    },
    discountPercentage: {
        type: Number,
        required: true
    },
    validFrom: {
        type: Date,
        required: true
    },
    validTo: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Promo = mongoose.model('Promo', promoSchema);
module.exports = Promo;