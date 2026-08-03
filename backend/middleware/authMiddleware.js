const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Fallback for header if cookies are restricted cross-domain
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new Error("Token is not present");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_KEY || "secretkey");

    const { _id } = payload;

    if (!_id) {
      throw new Error("Invalid token");
    }

    const result = await User.findById(_id).select("-password");

    if (!result) {
      throw new Error("User Doesn't Exist");
    }

    req.result = result;
    req.user = result;

    next();
  } catch (err) {
    res.status(401).send("Error: " + err.message);
  }
};

module.exports = {
  userMiddleware,
  protect: userMiddleware,
};
