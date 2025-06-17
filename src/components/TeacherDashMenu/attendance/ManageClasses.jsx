// Fixed ManageClasses.jsx with robust class creation and display
import React, { useContext, useState, useEffect } from 'react';
import { AttendanceContext } from '../context/AttendanceContext';

const ManageClasses = () => {
  const { classes, loading, addClass, fetchClasses, error: contextError } = useContext(AttendanceContext);
  
  const [newClass, setNewClass] = useState({
    className: '',
    description: ''
  });
  
  const [localLoading, setLocalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [classesLoaded, setClassesLoaded] = useState(false);

  // Fetch classes when component mounts
  useEffect(() => {
    const loadClasses = async () => {
      if (!classesLoaded) {
        setLocalLoading(true);
        try {
          await fetchClasses();
          setClassesLoaded(true);
        } catch (err) {
          console.error('Error loading classes in component:', err);
          setError('Failed to load classes. Please refresh the page.');
        } finally {
          setLocalLoading(false);
        }
      }
    };
    
    loadClasses();
  }, [fetchClasses, classesLoaded]);

  // Update local error state if context error changes
  useEffect(() => {
    if (contextError) {
      setError(contextError);
    }
  }, [contextError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClass(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error/success messages when user starts typing
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    
    // Enhanced validation
    if (!newClass.className.trim()) {
      setError('Class name cannot be empty');
      return;
    }
    
    // Check for duplicate class names
    const isDuplicate = classes.some(
      c => c.className.toLowerCase() === newClass.className.toLowerCase()
    );
    
    if (isDuplicate) {
      setError('A class with this name already exists');
      return;
    }
    
    setLocalLoading(true);
    
    try {
      // Add class through context
      const result = await addClass(newClass);
      console.log('Class added successfully:', result);
      
      // Reset form
      setNewClass({
        className: '',
        description: ''
      });
      
      setSuccessMessage('Class added successfully!');
      
      // Explicitly refetch classes to ensure the list is up to date
      await fetchClasses();
    } catch (err) {
      console.error('Error adding class in component:', err);
      setError(err.response?.data?.error || 'Failed to add class. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  // Combined loading state
  const isLoading = loading || localLoading;

  return (
    <div className="schedule-form">
      <h3>Add New Class</h3>
      
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '10px', padding: '8px', backgroundColor: '#ffeeee', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message" style={{ color: 'green', marginBottom: '10px', padding: '8px', backgroundColor: '#eeffee', borderRadius: '4px' }}>
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="className">Class Name</label>
          <input
            type="text"
            id="className"
            name="className"
            value={newClass.className}
            onChange={handleChange}
            required
            placeholder="E.g. Mathematics 101"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (Optional)</label>
          <input
            type="text"
            id="description"
            name="description"
            value={newClass.description}
            onChange={handleChange}
            placeholder="Brief description about the class"
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className="btn-schedule" 
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add Class'}
        </button>
      </form>

      <div className="class-list" style={{ marginTop: '30px' }}>
        <h3>Existing Classes</h3>
        <button 
          onClick={() => fetchClasses()} 
          style={{ 
            marginBottom: '10px', 
            padding: '5px 10px', 
            backgroundColor: '#f0f0f0', 
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Classes'}
        </button>
        
        {isLoading ? (
          <p>Loading classes...</p>
        ) : classes.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Class Name</th>
                <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {classes.map(classItem => (
                <tr key={classItem._id}>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{classItem.className}</td>
                  <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>{classItem.description || 'No description'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No classes available. Add your first class above.</p>
        )}
      </div>
    </div>
  );
};

export default ManageClasses;