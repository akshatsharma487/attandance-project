import React, { useState, useEffect, useCallback } from 'react';
import { attendanceAPI } from '../utils/api';
import { format } from 'date-fns';

const TeamAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const fetchAttendance = useCallback(async () => {
    try {
      const response = await attendanceAPI.getTeamAttendance({ date: selectedDate });
      setAttendance(response.data.data);
    } catch (error) {
      console.error('Error fetching team attendance:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div className="container">
        <h1>Team Attendance</h1>

        <div className="card">
          <div className="form-group">
            <label>Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Employee ID</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendance.map((record) => (
                  <tr key={record._id}>
                    <td>{record.user?.name}</td>
                    <td>{record.user?.employeeId}</td>
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
                      <span className={`badge badge-success`}>{record.status}</span>
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

export default TeamAttendance;
