import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../utils/api';
import { getCurrentLocation } from '../utils/location';
import { saveTimerState, clearTimerState, calculateElapsedTime } from '../utils/timer';
import './AttendanceTracker.css';

const AttendanceTracker = ({ todayAttendance, onUpdate }) => {
  const [attendance, setAttendance] = useState(todayAttendance);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState({ hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    setAttendance(todayAttendance);
  }, [todayAttendance]);

  useEffect(() => {
    if (attendance?.checkIn?.time && !attendance?.checkOut?.time) {
      const interval = setInterval(() => {
        const elapsed = calculateElapsedTime(attendance.checkIn.time);
        setTimer(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [attendance]);

  const handleCheckIn = async () => {
    setLoading(true);
    setError('');

    try {
      const location = await getCurrentLocation();
      const response = await attendanceAPI.checkIn(location);

      setAttendance(response.data.data);
      saveTimerState(response.data.data.checkIn.time);

      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to check in');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    setError('');

    try {
      const location = await getCurrentLocation();
      const response = await attendanceAPI.checkOut(location);

      setAttendance(response.data.data);
      clearTimerState();

      if (onUpdate) onUpdate();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to check out');
    } finally {
      setLoading(false);
    }
  };

  const isCheckedIn = attendance?.checkIn?.time && !attendance?.checkOut?.time;
  const isCheckedOut = attendance?.checkOut?.time;

  return (
    <div className="attendance-tracker card">
      <h2>Today's Attendance</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="tracker-content">
        {!attendance?.checkIn?.time && (
          <div className="tracker-status">
            <p>You haven't checked in yet today</p>
            <button
              onClick={handleCheckIn}
              className="btn btn-success btn-large"
              disabled={loading}
            >
              {loading ? 'Checking in...' : 'Check In'}
            </button>
          </div>
        )}

        {isCheckedIn && (
          <div className="tracker-status">
            <div className="timer">
              <div className="timer-display">
                <span className="timer-digit">{timer.hours}</span>
                <span className="timer-separator">:</span>
                <span className="timer-digit">{timer.minutes}</span>
                <span className="timer-separator">:</span>
                <span className="timer-digit">{timer.seconds}</span>
              </div>
              <p className="timer-label">Working Hours</p>
            </div>

            <div className="tracker-info">
              <p>
                <strong>Checked in at:</strong>{' '}
                {new Date(attendance.checkIn.time).toLocaleTimeString()}
              </p>
              <p>
                <strong>Location:</strong> {attendance.checkIn.location?.address}
              </p>
            </div>

            <button
              onClick={handleCheckOut}
              className="btn btn-danger btn-large"
              disabled={loading}
            >
              {loading ? 'Checking out...' : 'Check Out'}
            </button>
          </div>
        )}

        {isCheckedOut && (
          <div className="tracker-status">
            <div className="completion-message">
              <h3>Work completed for today!</h3>
              <div className="work-summary">
                <div className="summary-item">
                  <strong>Check In:</strong>
                  <span>{new Date(attendance.checkIn.time).toLocaleTimeString()}</span>
                </div>
                <div className="summary-item">
                  <strong>Check Out:</strong>
                  <span>{new Date(attendance.checkOut.time).toLocaleTimeString()}</span>
                </div>
                <div className="summary-item highlight">
                  <strong>Total Hours:</strong>
                  <span>{attendance.totalHours?.toFixed(2)} hours</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceTracker;
