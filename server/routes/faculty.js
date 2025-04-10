// routes/faculty.js (unchanged)
const express = require('express');
const {
  markAttendance,
  getStudentsByFilters,
  getMarkedAttendance,
  updateAttendance,
  getFacultyProfile,
  updatePassword,
  updateStudent,
} = require('../controllers/facultyController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/attendance', authMiddleware('faculty'), markAttendance);
router.get('/students', authMiddleware('faculty'), getStudentsByFilters);
router.get('/attendance', authMiddleware('faculty'), getMarkedAttendance);
router.put('/attendance/:attendanceId', authMiddleware('faculty'), updateAttendance);
router.get('/profile', authMiddleware('faculty'), getFacultyProfile);
router.put('/password', authMiddleware('faculty'), updatePassword);
router.put('/students/:id', authMiddleware('faculty'), updateStudent);

module.exports = router;