const express = require('express');
const { getAllUsers, getSystemStats, getRequests, updateRequestStatus, createUser, updateUser, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { checkRoleAndAbility } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.get('/users', checkRoleAndAbility('manage', 'all'), getAllUsers);
router.post('/users', checkRoleAndAbility('manage', 'all'), upload.single('profileImage'), createUser);
router.put('/users/:id', checkRoleAndAbility('manage', 'all'), upload.single('profileImage'), updateUser);
router.delete('/users/:id', checkRoleAndAbility('manage', 'all'), deleteUser);

router.get('/stats', checkRoleAndAbility('manage', 'all'), getSystemStats);
router.get('/requests', checkRoleAndAbility('read', 'Request'), getRequests);
router.put('/requests/:id/status', checkRoleAndAbility('update', 'Request'), updateRequestStatus);

module.exports = router;
