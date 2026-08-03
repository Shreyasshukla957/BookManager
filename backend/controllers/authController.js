const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new Error("Please add all required fields");
    }

    const emailId = email.toLowerCase();
    const userExists = await User.findOne({ email: emailId });
    if (userExists) {
      throw new Error("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: emailId,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { _id: user._id, emailId: user.email },
      process.env.JWT_SECRET || process.env.JWT_KEY || 'secretkey',
      { expiresIn: 60 * 60 }
    );

    const reply = {
      name: user.name,
      email: user.email,
      _id: user._id,
    };

    res.cookie('token', token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(201).json({
      user: reply,
      token,
      message: "Loggin Successfully"
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Invalid Credentials");
    }

    const emailId = email.toLowerCase();
    const user = await User.findOne({ email: emailId });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new Error("Invalid Credentials");
    }

    const reply = {
      name: user.name,
      email: user.email,
      _id: user._id,
    };

    const token = jwt.sign(
      { _id: user._id, emailId: user.email },
      process.env.JWT_SECRET || process.env.JWT_KEY || 'secretkey',
      { expiresIn: 60 * 60 }
    );

    res.cookie('token', token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({
      user: reply,
      token,
      message: "Loggin Successfully"
    });
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    res.send("Logged Out Succesfully");
  } catch (err) {
    res.status(503).send("Error: " + err.message);
  }
};

const getMe = async (req, res) => {
  try {
    const user = req.result;
    const reply = {
      name: user.name,
      email: user.email,
      _id: user._id,
    };
    res.status(200).json({
      user: reply,
      message: "Valid User"
    });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  registerUser: register,
  loginUser: login,
  logoutUser: logout,
};
