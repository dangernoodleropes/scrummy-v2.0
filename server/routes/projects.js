const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController.js');

router.post('/', projectController.addProject, (req, res) => {
  res.status(200).json(res.locals.savedProject);
});

router.get('/:user', projectController.seeProjects, (req, res) => {
  res.status(200).json(res.locals.projects);
});

router.get('/:user/:value', projectController.loadProject, (req, res) => {
  res.status(200).json(res.locals.project);
});

module.exports = router;
