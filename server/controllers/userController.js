const User = require('../models/userModel.js');

const userController = {};

userController.addUser = async (req, res, next) => {
  const { name } = req.body;
  try {
    const already = await User.findOne({ name });
    if (already) {
      next();
    } else {
      const newUser = await User.create({ name });
      next();
    }
  } catch (err) {
    return next({ log: 'Error adding user', message: err });
  }
};
