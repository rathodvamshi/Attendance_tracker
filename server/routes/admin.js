const express = require('express');
const { createStudent, getStudents } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/students', authMiddleware('admin'), createStudent);
router.get('/students', authMiddleware('admin'), getStudents);

module.exports = router;