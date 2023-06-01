const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  madeBy: String,
  content: String,
  taskID: String,
});

module.exports = mongoose.model('task', taskSchema);
