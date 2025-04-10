import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Faculty Portal</h2>
      <nav>
        <NavLink to="/faculty" end className="sidebar-link" activeClassName="active">
          <span>🏠</span> Dashboard
        </NavLink>
        <NavLink to="/faculty/profile" className="sidebar-link" activeClassName="active">
          <span>👤</span> Profile
        </NavLink>
        <NavLink to="/faculty/mark-attendance" className="sidebar-link" activeClassName="active">
          <span>✍️</span> Mark Attendance
        </NavLink>
        <NavLink to="/faculty/manage-attendance" className="sidebar-link" activeClassName="active">
          <span>📅</span> Manage Attendance
        </NavLink>
        <NavLink to="/faculty/view-student" className="sidebar-link" activeClassName="active">
          <span>👨‍🎓</span> View Student
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;