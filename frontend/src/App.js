import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Attendance from './pages/Attendance';
import Leaves from './pages/Leaves';
import Employees from './pages/Employees';
import Departments from './pages/Departments';
import Roles from './pages/Roles';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/employee/*"
            element={
              <PrivateRoute roles={['employee']}>
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/manager/*"
            element={
              <PrivateRoute roles={['manager']}>
                <ManagerDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/*"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <PrivateRoute>
                <Attendance />
              </PrivateRoute>
            }
          />

          <Route
            path="/leaves"
            element={
              <PrivateRoute>
                <Leaves />
              </PrivateRoute>
            }
          />

          <Route
            path="/employees"
            element={
              <PrivateRoute roles={['admin', 'manager']}>
                <Employees />
              </PrivateRoute>
            }
          />

          <Route
            path="/departments"
            element={
              <PrivateRoute roles={['admin']}>
                <Departments />
              </PrivateRoute>
            }
          />

          <Route
            path="/roles"
            element={
              <PrivateRoute roles={['admin']}>
                <Roles />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
