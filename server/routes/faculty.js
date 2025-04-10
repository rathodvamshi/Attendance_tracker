const express = require('express');
const { markAttendance, getStudentsByFilters, getMarkedAttendance, updateAttendance, getFacultyProfile, updatePassword, getStudentsBySearch, updateStudent } = require('../controllers/facultyController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/attendance', authMiddleware('faculty'), markAttendance);
router.get('/students', authMiddleware('faculty'), getStudentsByFilters);
router.get('/attendance', authMiddleware('faculty'), getMarkedAttendance);
router.put('/attendance/:attendanceId', authMiddleware('faculty'), updateAttendance);
router.get('/profile', authMiddleware('faculty'), getFacultyProfile);
router.put('/password', authMiddleware('faculty'), updatePassword);
router.get('/students/search', authMiddleware('faculty'), getStudentsBySearch); // Line 12
router.put('/students/:studentId', authMiddleware('faculty'), updateStudent);

module.exports = router;