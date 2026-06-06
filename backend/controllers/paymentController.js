const Payment = require('../models/Payment');
const Request = require('../models/Request');
const { createPaymentIntent } = require('../services/stripeService');
const Joi = require('joi');

const createPaymentSchema = Joi.object({
    requestId: Joi.string().required(),
    amount: Joi.number().required(),
});

// @desc    Create a payment intent & record
// @route   POST /api/payments
// @access  Private (User)
const processPayment = async (req, res) => {
    try {
        const { error } = createPaymentSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { requestId, amount } = req.body;

        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Call Stripe Service
        const paymentIntent = await createPaymentIntent(amount);

        const payment = await Payment.create({
            requestId,
            userId: req.user._id,
            stripePaymentId: paymentIntent.id,
            amount,
            status: 'pending',
        });

        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
            payment,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get user payments
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user._id }).populate('requestId');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { processPayment, getPayments };
