const jwt = require('jsonwebtoken');
const User = require('../models/User');

const userMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error('Token is not present');
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const { _id, id } = payload;
    const userId = _id || id;

    if (!userId) {
      throw new Error('Invalid token');
    }

    const result = await User.findById(userId).select('-password');

    if (!result) {
      throw new Error("User Doesn't Exist");
    }

    req.result = result;
    req.user = result;

    next();
  } catch (err) {
    res.status(401).send('Error: ' + err.message);
  }
};

module.exports = { protect: userMiddleware, userMiddleware };
