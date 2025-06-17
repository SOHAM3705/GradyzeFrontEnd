// ManageStudents.jsx
import React, { useContext, useState, useEffect } from 'react';
import { AttendanceContext } from '../context/AttendanceContext';

const ManageStudents = () => {
  const { classes, students, loading, loadStudents } = useContext(AttendanceContext);
  
  const [selectedClass, setSelectedClass] = useState('');

  useEffect(() => {
    // Load students for the selected class
    if (selectedClass) {
      loadStudents(selectedClass);
    }
  }, [selectedClass, loadStudents]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  return (
    <div className="student-list-container">
      <h3>Manage Students</h3>
      
      <div className="filter-group">
        <label htmlFor="classId">Select Class</label>
        <select
          id="classId"
          value={selectedClass}
          onChange={handleClassChange}
          required
        >
          <option value="">-- Select Class --</option>
          {classes.map(classItem => (
            <option key={classItem._id} value={classItem._id}>
              {classItem.className}
            </option>
          ))}
        </select>
      </div>

      {selectedClass && (
        <div className="class-list" style={{ marginTop: '30px' }}>
          <h3>Students in Selected Class</h3>
          {loading ? (
            <p>Loading students...</p>
          ) : students.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll Number</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.rollNumber}</td>
                    <td>{student.email || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No students available in this class.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageStudents;