const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

exports.createStudent = async (req, res) => {
  const { name, email, password, mobile, department, year, section, image } = req.body;
  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) return res.status(400).json({ message: 'Student already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      name, email, password: hashedPassword, mobile, department, year, section, image,
    });
    await student.save();
    res.status(201).json({ message: 'Student created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};