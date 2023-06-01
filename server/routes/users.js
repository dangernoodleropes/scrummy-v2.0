const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController.js');

router.post('/', userController.addUser, (req, res) => {
  res.sendStatus(200);
});

module.exports = router;
