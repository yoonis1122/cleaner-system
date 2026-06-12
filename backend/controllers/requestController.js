const Request = require('../models/Request');
const Joi = require('joi');

const createRequestSchema = Joi.object({
    serviceType: Joi.string().required(),
    price: Joi.number().required(),
    address: Joi.string().required(),
});

// @desc    Create new request
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res) => {
    try {
        const { error } = createRequestSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { serviceType, price, address } = req.body;

        const request = await Request.create({
            userId: req.user._id,
            serviceType,
            price,
            address,
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get user requests
// @route   GET /api/requests
// @access  Private
const getUserRequests = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'user') {
            query.userId = req.user._id;
        } else if (req.user.role === 'cleaner') {
            // Cleaners fetch their accepted requests or pending available ones based on business logic
            // For now, let's fetch requests where they are assigned, or maybe all pending
            query = { $or: [{ status: { $in: ['pending', 'scheduled'] } }, { cleanerId: req.user._id }] };
        }
        
        const requests = await Request.find(query).populate('userId', 'name email').sort({ timeSlot: 1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update request status
// @route   PUT /api/requests/:id
// @access  Private (Cleaner/Admin)
const updateRequestStatus = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Only cleaners and admins can update status. Users can cancel their own, etc.
        // Handled basically by our ability middleware, but we can do extra checks.
        
        request.status = req.body.status || request.status;
        if (req.user.role === 'cleaner' && req.body.status === 'accepted') {
            request.cleanerId = req.user._id;
        }

        const updatedRequest = await request.save();
        res.json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { createRequest, getUserRequests, updateRequestStatus };
