import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AttendanceTracker from '../components/AttendanceTracker';
import Attendance from './Attendance';
import Leaves from './Leaves';
import { dashboardAPI } from '../utils/api';
import './Dashboard.css';

const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getEmployeeDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <Routes>
          <Route
            path="/"
            element={
              <div className="container">
                <h1>Employee Dashboard</h1>

                <AttendanceTracker
                  todayAttendance={dashboardData?.todayAttendance}
                  onUpdate={fetchDashboard}
                />

                <div className="grid grid-3">
                  <div className="stat-card">
                    <h3>Monthly Attendance</h3>
                    <p className="stat-value">{dashboardData?.stats?.monthlyAttendance || 0}</p>
                    <p className="stat-label">Days</p>
                  </div>

                  <div className="stat-card">
                    <h3>Leaves Taken</h3>
                    <p className="stat-value">{dashboardData?.stats?.totalLeaveTaken || 0}</p>
                    <p className="stat-label">Days</p>
                  </div>

                  <div className="stat-card">
                    <h3>Pending Leaves</h3>
                    <p className="stat-value">{dashboardData?.stats?.pendingLeaves || 0}</p>
                    <p className="stat-label">Requests</p>
                  </div>
                </div>

                <div className="quick-actions">
                  <h2>Quick Actions</h2>
                  <div className="grid grid-2">
                    <Link to="/employee/attendance" className="action-card">
                      <h3>Attendance History</h3>
                      <p>View your attendance records</p>
                    </Link>
                    <Link to="/employee/leaves" className="action-card">
                      <h3>Manage Leaves</h3>
                      <p>Apply for leave or view leave history</p>
                    </Link>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leaves" element={<Leaves />} />
        </Routes>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
