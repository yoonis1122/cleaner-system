const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, bookPickup } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, upload.single('profileImage'), updateUserProfile);

router.post('/book-pickup', protect, bookPickup);

module.exports = router;
