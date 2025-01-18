const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, '86485824e5de4935d285cbe3616ee00d56f07179832483f7d04a09694baba93e9538c31b66286eb0f50062c27bc164cdaa75a48bb6b6aacc23d243245fea721d', { expiresIn: '7d' });
};

// Register a new user
exports.registerUser = async (req, res) => {
  console.log(`Entered registering`);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and Password are required' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = await User.create({ email, password });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    console.log(`Found ${user}, ${password}`);
    if (user && (await user.matchPassword(password))) {
      console.log('Entered returning response after matching');
      res.status(200).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in from the backend-side', error });
  }
};

// Get user profile (protected route example)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};
