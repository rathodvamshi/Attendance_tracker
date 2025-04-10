const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

exports.markAttendance = async (req, res) => {
  const { date, department, year, section, period, day, students } = req.body;
  try {
    console.log('Marking attendance with data:', { date, department, year, section, period, day, students });
    const faculty = await Faculty.findById(req.user.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    faculty.tempAttendance.push({ date, department, year, section, period, day, students });
    await faculty.save();

    for (const { studentId, present } of students) {
      const student = await Student.findById(studentId);
      if (student) {
        console.log(`Updating student ${studentId} attendance for ${day}, period ${period}: ${present ? 1 : 0}`);
        student.attendance[day][period - 1] = present ? 1 : 0;
        await student.save();
      } else {
        console.warn(`Student ${studentId} not found`);
      }
    }

    res.json({ message: 'Attendance marked successfully' });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error marking attendance' });
  }
};

exports.getStudentsByFilters = async (req, res) => {
  const { department, year, section } = req.query;
  try {
    console.log('Fetching students with filters:', { department, year, section });
    if (!department || !year || !section) {
      console.log('Missing filters');
      return res.status(400).json({ message: 'All filters (department, year, section) are required' });
    }

    const students = await Student.find({
      department,
      year: parseInt(year),
      section,
    });

    console.log(`Found ${students.length} students:`, students.map(s => s.name));
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error fetching students' });
  }
};

exports.getMarkedAttendance = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user.id).populate('tempAttendance.students.studentId', 'name email');
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json(faculty.tempAttendance);
  } catch (error) {
    console.error('Error fetching marked attendance:', error);
    res.status(500).json({ message: 'Server error fetching attendance' });
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
        student.attendance[day][period - 1] = present ? 1 : 0;
        await student.save();
      }
    }

    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Server error updating attendance' });
  }
};

exports.getFacultyProfile = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.user.id).select('-password -tempAttendance');
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
    res.json(faculty);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const faculty = await Faculty.findById(req.user.id);
    if (!faculty) return res.status(404).json({ message: 'Faculty not found' });

    const isMatch = await bcrypt.compare(oldPassword, faculty.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });

    const salt = await bcrypt.genSalt(10);
    faculty.password = await bcrypt.hash(newPassword, salt);
    await faculty.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error updating password' });
  }
};

exports.getStudentsBySearch = async (req, res) => {
  const { search, department, year, section } = req.query;
  try {
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    } else if (department && year && section) {
      query = {
        department,
        year: parseInt(year),
        section,
      };
    } else {
      return res.status(400).json({ message: 'Provide search term or all filters (department, year, section)' });
    }

    const students = await Student.find(query);
    console.log(`Found ${students.length} students by search/filters:`, students.map(s => s.name));
    res.json(students);
  } catch (error) {
    console.error('Error fetching students by search:', error);
    res.status(500).json({ message: 'Server error fetching students' });
  }
};

exports.updateStudent = async (req, res) => {
  const { studentId } = req.params;
  const { name, email, mobile, department, year, section, image } = req.body;
  try {
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.name = name || student.name;
    student.email = email || student.email;
    student.mobile = mobile || student.mobile;
    student.department = department || student.department;
    student.year = year || student.year;
    student.section = section || student.section;
    student.image = image || student.image;

    await student.save();
    res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error updating student' });
  }
};