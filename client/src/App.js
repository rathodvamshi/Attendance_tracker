import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import FacultyDashboard from './components/FacultyDashboard';
import AdminProfile from './components/AdminProfile';
import FacultyProfile from './components/FacultyProfile';
import CreateStudent from './components/CreateStudent';
import CreateFaculty from './components/CreateFaculty';
import ListStudents from './components/ListStudents';
import ListFaculty from './components/ListFaculty';
import AttendanceTable from './components/AttendanceTable';
import ManageAttendance from './components/ManageAttendance';
import ViewStudent from './components/ViewStudent';

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/profile" element={<AdminProfile />} />
      <Route path="/admin/create-student" element={<CreateStudent />} />
      <Route path="/admin/create-faculty" element={<CreateFaculty />} />
      <Route path="/admin/list-students" element={<ListStudents />} />
      <Route path="/admin/list-faculty" element={<ListFaculty />} />
      {/* Faculty Routes */}
      <Route path="/faculty/*" element={<FacultyDashboard />}>
        <Route path="" element={<div />} /> {/* Default content handled in FacultyDashboard */}
        <Route path="profile" element={<FacultyProfile />} />
        <Route path="mark-attendance" element={<AttendanceTable />} />
        <Route path="manage-attendance" element={<ManageAttendance />} />
        <Route path="view-student" element={<ViewStudent />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;