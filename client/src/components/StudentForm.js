import React, { useState } from 'react';
import axios from 'axios';
import '../styles/StudentForm.css';

const StudentForm = ({ onAddStudent }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', mobile: '', department: '', year: '', section: '', image: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/admin/students', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onAddStudent(formData);
      setFormData({ name: '', email: '', password: '', mobile: '', department: '', year: '', section: '', image: '' });
      alert(res.data.message);
    } catch (err) {
      setError('Error creating student');
    }
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <input type="text" name="mobile" placeholder="Mobile" value={formData.mobile} onChange={handleChange} required />
      <select name="department" value={formData.department} onChange={handleChange} required>
        <option value="">Select Department</option>
        <option value="CSE">CSE</option>
        <option value="ECE">ECE</option>
      </select>
      <select name="year" value={formData.year} onChange={handleChange} required>
        <option value="">Select Year</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <select name="section" value={formData.section} onChange={handleChange} required>
        <option value="">Select Section</option>
        <option value="A">A</option>
        <option value="B">B</option>
      </select>
      <input type="file" name="image" onChange={handleImageChange} />
      {error && <p className="error">{error}</p>}
      <button type="submit" className="submit-btn">Add Student</button>
    </form>
  );
};

export default StudentForm;