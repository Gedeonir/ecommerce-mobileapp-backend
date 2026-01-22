const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({
    method: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
}, { timestamps: true });

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);
module.exports = PaymentMethod;