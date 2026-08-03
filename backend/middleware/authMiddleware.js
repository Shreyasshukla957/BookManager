const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwtSecret = process.env.JWT_SKEY || process.env.JWT_KEY || process.env.JWT_SECRET || 'secretkey';

const userMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).send("Error: Token is not present");
    }

    const payload = jwt.verify(token, jwtSecret);
    if (!payload?._id) return res.status(401).send("Error: Invalid token");

    const result = await User.findById(payload._id).select("-password");
    if (!result) return res.status(401).send("Error: User Doesn't Exist");

    req.result = result;
    req.user = result;
    next();
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

module.exports = { userMiddleware, protect: userMiddleware };