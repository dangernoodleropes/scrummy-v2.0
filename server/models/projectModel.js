const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
  madeBy: String,
  tasks: Array,
  name: String,
});

module.exports = mongoose.model('project', projectSchema);
