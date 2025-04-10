import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import AttendanceTable from './AttendanceTable';
import ManageAttendance from './ManageAttendance';
import Profile from './Profile';
import ViewStudent from './ViewStudent';
import '../styles/FacultyDashboard.css';

const FacultyDashboard = () => {
  const [filters, setFilters] = useState({
    department: '',
    year: '',
    section: '',
    date: '',
    period: '',
    day: '',
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="faculty-dashboard">
      <Sidebar />
      <div className="content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h1 className="dashboard-title">Faculty Dashboard</h1>
                <p className="welcome-text">Welcome to your dashboard. Select an option from the sidebar.</p>
              </>
            }
          />
          <Route
            path="/mark-attendance"
            element={
              <>
                <h1 className="dashboard-title">Mark Attendance</h1>
                <div className="filters">
                  <select name="department" onChange={handleFilterChange} value={filters.department}>
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                  </select>
                  <select name="year" onChange={handleFilterChange} value={filters.year}>
                    <option value="">Select Year</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                  <select name="section" onChange={handleFilterChange} value={filters.section}>
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                  </select>
                  <input type="date" name="date" onChange={handleFilterChange} value={filters.date} />
                  <select name="period" onChange={handleFilterChange} value={filters.period}>
                    <option value="">Select Period</option>
                    {[...Array(7)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <select name="day" onChange={handleFilterChange} value={filters.day}>
                    <option value="">Select Day</option>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <AttendanceTable filters={filters} />
              </>
            }
          />
          <Route path="/manage-attendance" element={<ManageAttendance />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/view-student" element={<ViewStudent />} />
        </Routes>
      </div>
    </div>
  );
};

export default FacultyDashboard;