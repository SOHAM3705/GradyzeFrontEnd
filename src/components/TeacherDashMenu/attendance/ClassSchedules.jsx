// Fixed ClassSchedules.jsx with improved class loading
import React, { useContext, useEffect, useState } from 'react';
import { AttendanceContext } from '../context/AttendanceContext';

const ClassSchedules = () => {
  const { classes, schedules, fetchSchedules, fetchClasses, loading } = useContext(AttendanceContext);
  
  const [filter, setFilter] = useState({
    classId: '',
    date: ''
  });
  
  const [error, setError] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Fetch data on component mount and when tab becomes active
  useEffect(() => {
    const loadData = async () => {
      if (!dataLoaded) {
        setLocalLoading(true);
        setError(null);
        
        try {
          console.log('ClassSchedules: Loading initial data...');
          // First load classes, then schedules
          const classesData = await fetchClasses();
          console.log('ClassSchedules: Classes loaded:', classesData);
          
          const schedulesData = await fetchSchedules();
          console.log('ClassSchedules: Schedules loaded:', schedulesData);
          
          setDataLoaded(true);
        } catch (err) {
          console.error('Error loading data in ClassSchedules:', err);
          setError('Failed to load data. Please refresh the page.');
        } finally {
          setLocalLoading(false);
        }
      }
    };
    
    loadData();
  }, [fetchClasses, fetchSchedules, dataLoaded]);

  // Add a manual refresh function
  const handleRefresh = async () => {
    setLocalLoading(true);
    setError(null);
    
    try {
      await fetchClasses();
      await fetchSchedules();
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data. Please try again.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter schedules based on selected filters
  const filteredSchedules = schedules.filter(schedule => {
    let matchesClass = true;
    let matchesDate = true;
    
    if (filter.classId) {
      matchesClass = schedule.classId === filter.classId;
    }
    
    if (filter.date) {
      const scheduleDate = new Date(schedule.date).toISOString().split('T')[0];
      matchesDate = scheduleDate === filter.date;
    }
    
    return matchesClass && matchesDate;
  });

  // Get class name by ID with improved error handling
  const getClassName = (classId) => {
    const foundClass = classes.find(c => c._id === classId);
    return foundClass ? foundClass.className : 'Unknown Class';
  };

  // Format time for display (24h to 12h format)
  const formatTime = (time24h) => {
    if (!time24h) return 'N/A';
    
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12; // Convert 0 to 12
    return `${hour12}:${minutes} ${period}`;
  };

  // Check if a schedule is for today
  const isToday = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    const scheduleDate = new Date(dateString).toISOString().split('T')[0];
    return today === scheduleDate;
  };

  // Combined loading state
  const isLoading = loading || localLoading;

  return (
    <div className="records-container">
      <h3>Class Schedules</h3>
      
      {error && (
        <div className="error-message" style={{ color: 'red', marginBottom: '10px', padding: '8px', backgroundColor: '#ffeeee', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={handleRefresh} 
          disabled={isLoading}
          style={{ 
            padding: '5px 10px', 
            backgroundColor: '#f0f0f0', 
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
      
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="filterClassId">Filter by Class</label>
          <select 
            id="filterClassId" 
            name="classId" 
            value={filter.classId}
            onChange={handleFilterChange}
            disabled={isLoading}
          >
            <option value="">All Classes</option>
            {classes.map(classItem => (
              <option key={classItem._id} value={classItem._id}>
                {classItem.className}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="filterDate">Filter by Date</label>
          <input 
            type="date" 
            id="filterDate" 
            name="date"
            value={filter.date}
            onChange={handleFilterChange}
            disabled={isLoading}
          />
        </div>
      </div>

      {isLoading ? (
        <p>Loading schedules...</p>
      ) : filteredSchedules.length > 0 ? (
        <table className="records-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Date</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Class</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Title</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Time</th>
              <th style={{ borderBottom: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.map(schedule => (
              <tr 
                key={schedule._id} 
                style={isToday(schedule.date) ? { backgroundColor: '#ffffcc' } : {}}
              >
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                  {new Date(schedule.date).toLocaleDateString()}
                </td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                  {getClassName(schedule.classId)}
                </td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                  {schedule.title || 'N/A'}
                </td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                  {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                </td>
                <td style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                  {schedule.description || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No schedules found. Please add class schedules or adjust your filters.</p>
      )}
    </div>
  );
};

export default ClassSchedules;