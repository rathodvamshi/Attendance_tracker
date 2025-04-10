const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

exports.markAttendance = async (req, res) => {
  const { date, department, year, section, period, day, students } = req.body;
  try {
    const faculty = await Faculty.findById(req.user.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    faculty.tempAttendance.push({ date, department, year, section, period, day, students });
    await faculty.save();

    for (const { studentId, present } of students) {
      const student = await Student.findById(studentId);
      if (student) {
        // Ensure attendance[day] exists and is an array
        if (!student.attendance[day]) student.attendance[day] = Array(7).fill(0);
        student.attendance[day][period - 1] = present ? 1 : 0;
        await student.save();
      }
    }
    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudentsByFilters = async (req, res) => {
  const { department, year, section } = req.query;
  try {
    if (!department || !year || !section) {
      return res.status(400).json({ message: 'All filters (department, year, section) are required' });
    }
    const students = await Student.find({ 
      department, 
      year: parseInt(year), 
      section 
    });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMarkedAttendance = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user.id).populate('tempAttendance.students.studentId', 'name email');
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json(faculty.tempAttendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAttendance = async (req, res) => {
  const { attendanceId } = req.params;
  const { date, department, year, section, period, day, students } = req.body;
  try {
    const faculty = await Faculty.findById(req.user.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    const attendanceIndex = faculty.tempAttendance.findIndex(att => att._id.toString() === attendanceId);
    if (attendanceIndex === -1) return res.status(404).json({ message: 'Attendance record not found' });

    faculty.tempAttendance[attendanceIndex] = { date, department, year, section, period, day, students };
    await faculty.save();

    for (const { studentId, present } of students) {
      const student = await Student.findById(studentId);
      if (student) {
        if (!student.attendance[day]) student.attendance[day] = Array(7).fill(0);
        student.attendance[day][period - 1] = present ? 1 : 0;
        await student.save();
      }
    }
    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getFacultyProfile = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user.id).select('-password');
    if (!faculty || faculty.role !== 'faculty') return res.status(404).json({ message: 'Faculty not found' });
    res.json(faculty);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const faculty = await Faculty.findById(req.user.id);
    if (!faculty || faculty.role !== 'faculty') return res.status(404).json({ message: 'Faculty not found' });

    const isMatch = await bcrypt.compare(oldPassword, faculty.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

    faculty.password = await bcrypt.hash(newPassword, 10);
    await faculty.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, department, year, section } = req.body;
  try {
    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Update only allowed fields
    student.name = name || student.name;
    student.email = email || student.email;
    student.mobile = mobile || student.mobile;
    student.department = department || student.department;
    student.year = year ? parseInt(year) : student.year;
    student.section = section || student.section;

    await student.save();
    res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error' });
  }
};