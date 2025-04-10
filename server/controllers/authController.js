const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    console.log('Login attempt:', { email, role }); // Debugging log

    let user;
    if (role === 'faculty') {
      user = await Faculty.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') }, role: 'faculty' });
    } else if (role === 'student') {
      user = await Student.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    } else if (role === 'admin') {
      user = await Faculty.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') }, role: 'admin' });
    }

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ message: 'Invalid credentials: User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ message: 'Invalid credentials: Incorrect password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful for:', email);
    res.json({ token, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};