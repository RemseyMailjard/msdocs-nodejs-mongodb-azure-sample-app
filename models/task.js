const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    trim: true,
  },
  createDate: Date,
  completedDate: Date,
  completed: {
    type: Boolean,
    default: false,
  },
  userid: {
    type: Number, // Change to Number if userid is just a numeric identifier
    trim: true,
  },
  category: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  deadline: {
    type: Date,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"], // Enum to ensure only these values are used
    trim: true,
  },
});

module.exports = mongoose.model("Task", taskSchema);
