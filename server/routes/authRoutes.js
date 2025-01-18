const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/authController');
// const { authenticateUser } = require('../middleware/authenticationMiddleware');

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
// router.get('/profile', authenticateUser, getUserProfile);

module.exports = router;
