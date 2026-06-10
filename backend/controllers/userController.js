const User = require('../models/User');
const Request = require('../models/Request');
const { initiateWaafiPayment } = require('../services/waafiService');
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
    price: Joi.number().min(0.01).required(),
});

// @desc    Book a pickup (creates a pending schedule)
// @route   POST /api/users/book-pickup
// @access  Private
const bookPickup = async (req, res) => {
    try {
        const { error } = bookPickupSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { name, address, phoneNumber, timeSlot, price } = req.body;

        const request = await Request.create({
            userId: req.user._id,
            name,
            address,
            phoneNumber,
            timeSlot,
            serviceType: 'General Waste',
            price: Number(price),
            status: 'pending',
        });

        res.status(201).json({
            schedule: request
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Process payment via WaafiPay
// @route   POST /api/users/pay-waafi
// @access  Private
const processWaafiPayment = async (req, res) => {
    try {
        const { scheduleId, accountNo } = req.body;
        
        if (!scheduleId || !accountNo) {
            return res.status(400).json({ message: 'Schedule ID and Account Number are required' });
        }

        const request = await Request.findById(scheduleId);
        if (!request) return res.status(404).json({ message: 'Pickup schedule not found' });
        if (request.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const paymentResult = await initiateWaafiPayment(accountNo, request.price, `Pickup ID: ${request._id.toString().substring(0,8)}`);
        
        if (paymentResult.success) {
            request.waafiReferenceId = paymentResult.referenceId;
            request.status = 'scheduled'; // Payment complete, schedule is confirmed
            await request.save();
            res.json({ success: true, message: 'Payment processed successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Payment failed to process' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Payment gateway error' });
    }
};

module.exports = { getUserProfile, updateUserProfile, bookPickup, processWaafiPayment };
