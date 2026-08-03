const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';
const jwtSecret = process.env.JWT_SKEY || process.env.JWT_KEY || process.env.JWT_SECRET || 'secretkey';
const authCookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 1000,
  sameSite: isProduction ? 'none' : 'lax',
  secure: isProduction,
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) throw new Error("Please add all required fields");

    const emailId = email.toLowerCase();
    const userExists = await User.findOne({ email: emailId });
    if (userExists) throw new Error("User already exists with this email");

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: emailId, password: hashedPassword });
    const token = jwt.sign({ _id: user._id, emailId: user.email, role: 'user' }, jwtSecret, { expiresIn: 60 * 60 });
    const reply = { name: user.name, email: user.email, _id: user._id };

    res.cookie('token', token, authCookieOptions);
    res.status(201).json({ user: reply, message: "Register Successfully" });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Invalid Credentials");

    const emailId = email.toLowerCase();
    const user = await User.findOne({ email: emailId });
    if (!user) throw new Error("Invalid Credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid Credentials");

    const reply = { name: user.name, email: user.email, _id: user._id };
    const token = jwt.sign({ _id: user._id, emailId: user.email, role: user.role || 'user' }, jwtSecret, { expiresIn: 60 * 60 });

    res.cookie('token', token, authCookieOptions);
    res.status(200).json({ user: reply, message: "Login Successfully" });
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", authCookieOptions);
    res.send("Logged Out Successfully");
  } catch (err) {
    res.status(503).send("Error: " + err.message);
  }
};

const getMe = async (req, res) => {
  try {
    const user = req.result;
    const reply = { name: user.name, email: user.email, _id: user._id };
    res.status(200).json({ user: reply, message: "Valid User" });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

module.exports = { register, login, logout, getMe, registerUser: register, loginUser: login, logoutUser: logout };