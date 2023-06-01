const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController.js');

router.post('/', userController.addUser, (req, res) => {
  res.status(200).json(res.locals.newUser);
});

module.exports = router;
