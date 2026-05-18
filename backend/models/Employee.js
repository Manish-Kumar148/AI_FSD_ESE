const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  department: {
    type: String,
    required: [true, 'Department is required']
  },
  skills: {
    type: [String],
    required: [true, 'At least one skill is required']
  },
  performanceScore: {
    type: Number,
    required: [true, 'Performance score is required'],
    min: 0,
    max: 100
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required']
  }
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);
