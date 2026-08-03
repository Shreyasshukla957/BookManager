const jwt = require('jsonwebtoken');
const User = require('../models/User');

// function to generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { _id: id, id },
    process.env.JWT_SECRET,
    { expiresIn: '3d' }
  );
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
    });

    if (user) {
      const token = generateToken(user._id);
      res.cookie('token', token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        message: 'User registered successfully',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.cookie('token', token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      res.status(200).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        message: 'Logged in successfully',
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials (email or password incorrect)' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie('token', '', {
      expires: new Date(0),
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).send('Logged out successfully');
  } catch (error) {
    res.status(500).send('Error: ' + error.message);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
};
