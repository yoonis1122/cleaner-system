const express = require('express');
const { createRequest, getUserRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const { checkRoleAndAbility } = require('../middleware/roleMiddleware');

const router = express.Router();

// User needs ability to 'create' a Request
router.post('/', protect, checkRoleAndAbility('create', 'Request'), createRequest);

// Depends on the logic inside controller, but anyone authenticated should ideally have least 'read' access, filtered inside controller
router.get('/', protect, checkRoleAndAbility('read', 'Request'), getUserRequests);

// To update, we could check 'update' action. For CASL dynamic check, we normally fetch the entity first. 
// For simplicity, we assume if they reach here, controller will verify if their specific id matches via query.
// But checkRoleAndAbility('update', 'Request') ensures the 'class' level permission exists (e.g. they aren't 'user').
router.put('/:id', protect, checkRoleAndAbility('update', 'Request'), updateRequestStatus);

module.exports = router;
