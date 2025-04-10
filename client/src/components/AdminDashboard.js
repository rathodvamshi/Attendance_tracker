import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentForm from './StudentForm';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/admin/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data);
    };
    fetchStudents();
  }, []);

  const addStudent = (student) => {
    setStudents([...students, student]);
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <StudentForm onAddStudent={addStudent} />
      <div className="student-list">
        {students.map((student) => (
          <div key={student._id} className="student-card">
            <p>{student.name} - {student.email}</p>
            <p>{student.department} | Year: {student.year} | Section: {student.section}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;