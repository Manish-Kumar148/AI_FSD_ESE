const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

// @route   POST api/employees
// @desc    Add new employee
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, department, skills, performanceScore, experience } = req.body;

    let employee = await Employee.findOne({ email });
    if (employee) {
      return res.status(400).json({ msg: 'Employee already exists with this email' });
    }

    if (performanceScore === undefined || performanceScore === null) {
      return res.status(400).json({ msg: 'Validation error: Missing performance score' });
    }

    employee = new Employee({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience
    });

    await employee.save();
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/employees
// @desc    Get all employees
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/employees/search
// @desc    Search/Filter employees
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { department, name } = req.query;
    
    let query = {};
    if (department) {
      query.department = { $regex: new RegExp(department, 'i') };
    }
    if (name) {
      query.name = { $regex: new RegExp(name, 'i') };
    }

    const employees = await Employee.find(query);
    res.json(employees);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/employees/:id
// @desc    Delete employee
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    await Employee.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Employee removed successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Employee not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/employees/:id
// @desc    Update employee
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { performanceScore, skills, department } = req.body;
    
    let employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ msg: 'Employee not found' });
    }

    if (performanceScore !== undefined) employee.performanceScore = performanceScore;
    if (skills) employee.skills = skills;
    if (department) employee.department = department;

    await employee.save();
    res.json(employee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
