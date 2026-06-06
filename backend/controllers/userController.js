const User = require('../models/User');
const Request = require('../models/Request');
const { createPaymentIntent } = require('../services/stripeService');
const { uploadToImgBB } = require('../utils/imgbbService');
const Joi = require('joi');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.file) {
                const imgbbUrl = await uploadToImgBB(req.file.buffer);
                user.profileImage = imgbbUrl;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profileImage: updatedUser.profileImage,
                token: req.headers.authorization.split(' ')[1], // pass existing token back so frontend can update its store if needed
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const bookPickupSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    timeSlot: Joi.string().required(),
});

// @desc    Book a pickup and create stripe intent
// @route   POST /api/users/book-pickup
// @access  Private
const bookPickup = async (req, res) => {
    try {
        const { error } = bookPickupSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, address, phoneNumber, timeSlot } = req.body;

        // Create Stripe PaymentIntent for $10
        const paymentIntent = await createPaymentIntent(10);

        const request = await Request.create({
            userId: req.user._id,
            name,
            address,
            phoneNumber,
            timeSlot,
            serviceType: 'General Waste',
            price: 10,
            status: 'pending',
            paymentIntentId: paymentIntent.id,
        });

        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
            schedule: request
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getUserProfile, updateUserProfile, bookPickup };
