import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { attendanceAPI } from '../utils/api';
import { format } from 'date-fns';
import './Attendance.css';

const Attendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const fetchAttendance = useCallback(async () => {
    try {
      const params = {};
      if (dateRange.startDate && dateRange.endDate) {
        params.startDate = dateRange.startDate;
        params.endDate = dateRange.endDate;
      }

      const response = await attendanceAPI.getMyHistory(params);
      setAttendanceRecords(response.data.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchAttendance();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Attendance History</h1>

        <div className="card">
          <form onSubmit={handleFilter} className="filter-form">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Filter
            </button>
          </form>
        </div>

        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendanceRecords.map((record) => (
                  <tr key={record._id}>
                    <td>{format(new Date(record.date), 'dd MMM yyyy')}</td>
                    <td>
                      {record.checkIn?.time
                        ? format(new Date(record.checkIn.time), 'hh:mm a')
                        : '-'}
                    </td>
                    <td>
                      {record.checkOut?.time
                        ? format(new Date(record.checkOut.time), 'hh:mm a')
                        : '-'}
                    </td>
                    <td>
                      {record.totalHours ? `${record.totalHours.toFixed(2)} hrs` : '-'}
                    </td>
                    <td>
                      <span className={`badge badge-${getStatusClass(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const getStatusClass = (status) => {
  switch (status) {
    case 'present':
      return 'success';
    case 'absent':
      return 'danger';
    case 'half-day':
      return 'warning';
    case 'on-leave':
      return 'info';
    default:
      return 'secondary';
  }
};

export default Attendance;
