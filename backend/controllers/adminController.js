const User = require('../models/User');
const Request = require('../models/Request');
const Payment = require('../models/Payment');
const { uploadToImgBB } = require('../utils/imgbbService');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};



// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = async (req, res) => {
    try {
        const usersCount = await User.countDocuments({});
        const requestsCount = await Request.countDocuments({});
        const paymentsCount = await Payment.countDocuments({});

        res.json({
            users: usersCount,
            requests: requestsCount,
            payments: paymentsCount,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all pickup requests
// @route   GET /api/admin/requests
// @access  Private/Admin
const getRequests = async (req, res) => {
    try {
        const requests = await Request.find({}).sort({ timeSlot: 1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a pickup request status
// @route   PUT /api/admin/requests/:id/status
// @access  Private/Admin
const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await Request.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        
        request.status = status;
        const updatedRequest = await request.save();
        
        res.json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Create a new user
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        console.log('CREATE USER:', { body: req.body, file: !!req.file, contentType: req.headers['content-type'] });
        const { name, email, password, role, phoneNumber } = req.body || {};
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const userData = {
            name,
            email,
            password,
            role: role || 'user',
            phoneNumber: phoneNumber || '',
        };

        if (req.file) {
            const imgbbUrl = await uploadToImgBB(req.file.buffer);
            userData.profileImage = imgbbUrl;
        }

        const user = await User.create(userData);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phoneNumber: user.phoneNumber,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Update a user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const body = req.body || {};
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = body.name || user.name;
            user.email = body.email || user.email;
            user.role = body.role || user.role;
            if (body.phoneNumber !== undefined) {
                user.phoneNumber = body.phoneNumber;
            }
            
            if (body.password) {
                user.password = body.password;
            }

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
                phoneNumber: updatedUser.phoneNumber,
                profileImage: updatedUser.profileImage,
                createdAt: updatedUser.createdAt,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (deletedUser) {
            res.json({ message: 'User removed successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getAllUsers, getSystemStats, getRequests, updateRequestStatus, createUser, updateUser, deleteUser };
