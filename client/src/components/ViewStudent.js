import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ViewStudent.css';

const ViewStudent = () => {
  const [filters, setFilters] = useState({ department: '', year: '', section: '' });
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [error, setError] = useState('');

  // Fetch students when filters or search change
  useEffect(() => {
    fetchStudents();
  }, [filters, search]); // Trigger fetch on filter or search change

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = search
        ? { search }
        : { department: filters.department, year: filters.year, section: filters.section };

      if (!search && (!filters.department || !filters.year || !filters.section)) {
        setError('Please provide a search term or select all filters.');
        setStudents([]);
        return;
      }

      const res = await axios.get('http://localhost:5000/api/faculty/students/search', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setStudents(res.data);
      setError(res.data.length === 0 ? 'No students found.' : '');
    } catch (err) {
      setError('Failed to fetch students.');
      setStudents([]);
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setSearch(''); // Clear search when filters change
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setFilters({ department: '', year: '', section: '' }); // Clear filters when searching
  };

  const handleView = (student) => {
    setSelectedStudent(student);
  };

  const handleEdit = () => {
    setEditingStudent({ ...selectedStudent });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:5000/api/faculty/students/${editingStudent._id}`,
        editingStudent,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedStudent(res.data.student);
      setEditingStudent(null);
      setStudents((prev) =>
        prev.map((s) => (s._id === res.data.student._id ? res.data.student : s))
      );
      alert(res.data.message);
    } catch (err) {
      setError('Failed to update student.');
      console.error(err);
    }
  };

  return (
    <div className="view-student">
      <h1 className="title">View Students</h1>
      <div className="search-container">
        <div className="filters">
          <select name="department" value={filters.department} onChange={handleFilterChange}>
            <option value="">Department</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
          </select>
          <select name="year" value={filters.year} onChange={handleFilterChange}>
            <option value="">Year</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <select name="section" value={filters.section} onChange={handleFilterChange}>
            <option value="">Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
          <button onClick={fetchStudents} className="fetch-btn">Fetch</button>
        </div>
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={handleSearchChange}
          onKeyPress={(e) => e.key === 'Enter' && fetchStudents()}
          className="search-input"
        />
      </div>
      {error && <p className="error">{error}</p>}
      {students.length > 0 && (
        <>
          <div className="header-row">
            <span>Name</span>
            <span>Email</span>
            <span>Action</span>
          </div>
          <div className="student-list">
            {students.map((student) => (
              <React.Fragment key={student._id}>
                <span>{student.name}</span>
                <span>{student.email}</span>
                <span>
                  <button onClick={() => handleView(student)} className="view-btn">
                    View
                  </button>
                </span>
              </React.Fragment>
            ))}
          </div>
        </>
      )}

      {selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelectedStudent(null)}>
              ✖
            </button>
            <div className="student-profile">
              <div className="profile-image">
                <img
                  src={`/assets/${selectedStudent.image || 'default-student.png'}`}
                  alt="Student"
                />
              </div>
              <div className="profile-details">
                {editingStudent ? (
                  <>
                    <input
                      type="text"
                      value={editingStudent.name}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, name: e.target.value })
                      }
                    />
                    <input
                      type="email"
                      value={editingStudent.email}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, email: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      value={editingStudent.mobile}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, mobile: e.target.value })
                      }
                    />
                    <select
                      value={editingStudent.department}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, department: e.target.value })
                      }
                    >
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                    </select>
                    <select
                      value={editingStudent.year}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, year: e.target.value })
                      }
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                    <select
                      value={editingStudent.section}
                      onChange={(e) =>
                        setEditingStudent({ ...editingStudent, section: e.target.value })
                      }
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                    </select>
                    <div className="edit-actions">
                      <button onClick={handleSave} className="save-btn">
                        Save
                      </button>
                      <button onClick={() => setEditingStudent(null)} className="cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2>{selectedStudent.name}</h2>
                    <p>
                      <strong>Email:</strong> {selectedStudent.email}
                    </p>
                    <p>
                      <strong>Mobile:</strong> {selectedStudent.mobile || 'N/A'}
                    </p>
                    <p>
                      <strong>Department:</strong> {selectedStudent.department}
                    </p>
                    <p>
                      <strong>Year:</strong> {selectedStudent.year}
                    </p>
                    <p>
                      <strong>Section:</strong> {selectedStudent.section}
                    </p>
                    <button onClick={handleEdit} className="edit-btn">
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
            {selectedStudent.attendance && (
              <div className="attendance-table">
                <h3>Attendance</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Day</th>
                      {[...Array(7)].map((_, i) => (
                        <th key={i}>P{i + 1}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
                      (day) => (
                        <tr key={day}>
                          <td>{day}</td>
                          {(selectedStudent.attendance[day] || []).map((status, i) => (
                            <td key={i}>{status === 1 ? '✅' : '❌'}</td>
                          ))}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStudent;