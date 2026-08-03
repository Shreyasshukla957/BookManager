const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // Check Bearer header fallback for cross-domain requests
    if (!token || token === "null" || token === "undefined") {
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
      }
    }

    if (!token || token === "null" || token === "undefined") {
      return res.status(401).send("Error: Token is not present");
    }

    const jwtSecret = process.env.JWT_KEY || process.env.JWT_SECRET || 'secretkey';
    const payload = jwt.verify(token, jwtSecret);

    const { _id } = payload;
    if (!_id) {
      return res.status(401).send("Error: Invalid token");
    }

    const result = await User.findById(_id).select("-password");
    if (!result) {
      return res.status(401).send("Error: User Doesn't Exist");
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
