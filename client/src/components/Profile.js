import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Profile.css';

const Profile = () => {
  const [faculty, setFaculty] = useState(null);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/faculty/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFaculty(res.data);
      } catch (err) {
        setError('Failed to fetch profile.');
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleResetPassword = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:5000/api/faculty/password',
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setModalError('');
      alert(res.data.message);
      setShowModal(false);
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setModalError(err.response?.data?.message || 'Failed to update password.');
      console.error(err);
    }
  };

  if (!faculty) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-container">
      <h1 className="profile-title">Faculty Profile</h1>
      {error && <p className="error">{error}</p>}
      <div className="profile-card">
        <div className="profile-image">
          <img src={`/assets/${faculty.image}`} alt="Faculty Logo" />
        </div>
        <div className="profile-details">
          <h2>{faculty.name}</h2>
          <p><strong>Email:</strong> {faculty.email}</p>
          <p><strong>Mobile:</strong> {faculty.mobile}</p>
          <p><strong>Department:</strong> {faculty.department}</p>
          <p><strong>Role:</strong> {faculty.role}</p>
          <button className="reset-btn" onClick={() => setShowModal(true)}>
            Reset Password
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>✖</button>
            <h3>Reset Password</h3>
            {modalError && <p className="modal-error">{modalError}</p>}
            <div className="form-group">
              <label>Old Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button className="update-btn" onClick={handleResetPassword}>
              Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;