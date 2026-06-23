import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TeamAttendance from '../components/TeamAttendance';
import TeamLeaves from '../components/TeamLeaves';
import { dashboardAPI } from '../utils/api';
import './Dashboard.css';

const ManagerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getManagerDashboard();
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
                <h1>Manager Dashboard</h1>

                <div className="grid grid-4">
                  <div className="stat-card">
                    <h3>Team Members</h3>
                    <p className="stat-value">
                      {dashboardData?.stats?.totalTeamMembers || 0}
                    </p>
                  </div>

                  <div className="stat-card">
                    <h3>Present Today</h3>
                    <p className="stat-value">
                      {dashboardData?.stats?.presentToday || 0}
                    </p>
                  </div>

                  <div className="stat-card">
                    <h3>On Leave</h3>
                    <p className="stat-value">
                      {dashboardData?.stats?.onLeaveToday || 0}
                    </p>
                  </div>

                  <div className="stat-card">
                    <h3>Pending Leaves</h3>
                    <p className="stat-value">
                      {dashboardData?.stats?.pendingLeaves || 0}
                    </p>
                  </div>
                </div>

                <div className="quick-actions">
                  <h2>Quick Actions</h2>
                  <div className="grid grid-2">
                    <Link to="/manager/team-attendance" className="action-card">
                      <h3>Team Attendance</h3>
                      <p>View team attendance records</p>
                    </Link>
                    <Link to="/manager/team-leaves" className="action-card">
                      <h3>Leave Approvals</h3>
                      <p>Approve or reject leave requests</p>
                    </Link>
                  </div>
                </div>

                <div className="card">
                  <h2>Recent Team Activity</h2>
                  <h3>Today's Attendance</h3>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Check In</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData?.recentAttendance?.length === 0 ? (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center' }}>
                            No attendance records for today
                          </td>
                        </tr>
                      ) : (
                        dashboardData?.recentAttendance?.map((record) => (
                          <tr key={record._id}>
                            <td>{record.user?.name}</td>
                            <td>
                              {record.checkIn?.time
                                ? new Date(record.checkIn.time).toLocaleTimeString()
                                : '-'}
                            </td>
                            <td>
                              <span className={`badge badge-success`}>
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
            }
          />
          <Route path="/team-attendance" element={<TeamAttendance />} />
          <Route path="/team-leaves" element={<TeamLeaves />} />
        </Routes>
      </div>
    </div>
  );
};

export default ManagerDashboard;
