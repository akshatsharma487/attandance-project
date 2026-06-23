import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Employees from './Employees';
import Departments from './Departments';
import Roles from './Roles';
import { dashboardAPI } from '../utils/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getAdminDashboard();
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
                <h1>Admin Dashboard</h1>

                <div className="grid grid-4">
                  <div className="stat-card">
                    <h3>Total Employees</h3>
                    <p className="stat-value">
                      {dashboardData?.stats?.totalEmployees || 0}
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
                  <h2>Management</h2>
                  <div className="grid grid-3">
                    <Link to="/admin/employees" className="action-card">
                      <h3>Employees</h3>
                      <p>Manage employee accounts</p>
                    </Link>
                    <Link to="/admin/departments" className="action-card">
                      <h3>Departments</h3>
                      <p>Manage departments</p>
                    </Link>
                    <Link to="/admin/roles" className="action-card">
                      <h3>Roles</h3>
                      <p>Manage job roles</p>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-2">
                  <div className="card">
                    <h2>Recent Attendance</h2>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Check In</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData?.recentAttendance?.slice(0, 5).map((record) => (
                          <tr key={record._id}>
                            <td>{record.user?.name}</td>
                            <td>
                              {record.checkIn?.time
                                ? new Date(record.checkIn.time).toLocaleTimeString()
                                : '-'}
                            </td>
                            <td>
                              <span className="badge badge-success">
                                {record.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="card">
                    <h2>Recent Leave Requests</h2>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Type</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData?.recentLeaves?.slice(0, 5).map((leave) => (
                          <tr key={leave._id}>
                            <td>{leave.user?.name}</td>
                            <td className="capitalize">
                              {leave.leaveType.replace('-', ' ')}
                            </td>
                            <td>
                              <span
                                className={`badge badge-${
                                  leave.status === 'approved'
                                    ? 'success'
                                    : leave.status === 'rejected'
                                    ? 'danger'
                                    : 'warning'
                                }`}
                              >
                                {leave.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/employees" element={<Employees />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/roles" element={<Roles />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
