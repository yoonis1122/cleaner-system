const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    cleanerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    serviceType: {
        type: String,
        required: true,
        default: 'General Waste',
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'completed', 'cancelled', 'scheduled'],
        default: 'pending',
    },
    price: {
        type: Number,
        required: true,
        default: 10,
    },
    address: {
        type: String,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true,
    },
    paymentIntentId: {
        type: String,
    }
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);
module.exports = Request;
