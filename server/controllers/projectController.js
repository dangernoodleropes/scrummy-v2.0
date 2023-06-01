const Project = require('../models/projectModel.js');

const projectController = {};

projectController.addProject = async (req, res, next) => {
  const { user, tasks, value } = req.body;
  try {
    const savedProj = await Project.findOneAndUpdate(
      { madeBy: user, name: value },
      { tasks: tasks },
      { upsert: true, new: true }
    );
    res.locals.savedProj = savedProj;
    next();
  } catch (err) {
    return next({ log: 'Error saving project', message: err });
  }
};

projectController.seeProjects = async (req, res, next) => {
  const { user } = req.params;
  try {
    const projects = await Project.find({ madeBy: user });
    res.locals.projects = projects;
    next();
  } catch (err) {
    return next({ log: 'Error getting projects', message: err });
  }
};

projectController.loadProject = async (req, res, next) => {
  const { user, value } = req.params;
  try {
    const project = await Project.findOne({ madeBy: user, name: value });
    res.locals.project = project;
    next();
  } catch (err) {
    return next({ log: 'Error loading project', message: err });
  }
};

module.exports = projectController;
