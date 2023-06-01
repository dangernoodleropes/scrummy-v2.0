const User = require('../models/userModel.js');

const userController = {};

userController.addUser = async (req, res, next) => {
  const { username } = req.body;
  try {
    const already = await User.findOne({ username });
    if (already) {
      next();
    } else {
      const newUser = await User.create({ name: username });
      res.locals.newUser = newUser;
      next();
    }
  } catch (err) {
    return next({ log: 'Error adding user', message: err });
  }
};

module.exports = userController;
