import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const attendanceAPI = {
  checkIn: (data) => api.post('/attendance/check-in', data),
  checkOut: (data) => api.post('/attendance/check-out', data),
  getTodayAttendance: () => api.get('/attendance/today'),
  getMyHistory: (params) => api.get('/attendance/my-history', { params }),
  getTeamAttendance: (params) => api.get('/attendance/team', { params }),
  getAllAttendance: (params) => api.get('/attendance/all', { params }),
};

export const leaveAPI = {
  applyLeave: (data) => api.post('/leaves/apply', data),
  getMyLeaves: (params) => api.get('/leaves/my-leaves', { params }),
  getTeamLeaves: (params) => api.get('/leaves/team', { params }),
  getAllLeaves: (params) => api.get('/leaves/all', { params }),
  approveLeave: (id) => api.put(`/leaves/${id}/approve`),
  rejectLeave: (id, data) => api.put(`/leaves/${id}/reject`, data),
};

export const employeeAPI = {
  getAllEmployees: (params) => api.get('/employees', { params }),
  getEmployee: (id) => api.get(`/employees/${id}`),
  createEmployee: (data) => api.post('/employees', data),
  updateEmployee: (id, data) => api.put(`/employees/${id}`, data),
  deleteEmployee: (id) => api.delete(`/employees/${id}`),
  getMyTeam: () => api.get('/employees/my-team'),
};

export const departmentAPI = {
  getAllDepartments: () => api.get('/departments'),
  getDepartment: (id) => api.get(`/departments/${id}`),
  createDepartment: (data) => api.post('/departments', data),
  updateDepartment: (id, data) => api.put(`/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/departments/${id}`),
};

export const roleAPI = {
  getAllRoles: (params) => api.get('/roles', { params }),
  getRole: (id) => api.get(`/roles/${id}`),
  createRole: (data) => api.post('/roles', data),
  updateRole: (id, data) => api.put(`/roles/${id}`, data),
  deleteRole: (id) => api.delete(`/roles/${id}`),
};

export const dashboardAPI = {
  getAdminDashboard: () => api.get('/dashboard/admin'),
  getManagerDashboard: () => api.get('/dashboard/manager'),
  getEmployeeDashboard: () => api.get('/dashboard/employee'),
};

export default api;
