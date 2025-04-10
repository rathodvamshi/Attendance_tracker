import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout, toggleTheme } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleColorToggle = () => {
    toggleTheme(); // Switches between light and dark modes
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">{user?.role === 'admin' ? 'Admin Portal' : 'Faculty Portal'}</h1>
      <div className="navbar-actions">
        <button className="color-toggle-btn" onClick={handleColorToggle}>
          Toggle Mode
        </button>
        {user && (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;