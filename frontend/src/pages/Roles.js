import React, { useState, useEffect } from 'react';
import { roleAPI, departmentAPI } from '../utils/api';
import './Management.css';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roleRes, deptRes] = await Promise.all([
        roleAPI.getAllRoles(),
        departmentAPI.getAllDepartments(),
      ]);

      setRoles(roleRes.data.data);
      setDepartments(deptRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await roleAPI.createRole(formData);
      setShowForm(false);
      setFormData({ title: '', description: '', department: '' });
      fetchData();
    } catch (error) {
      console.error('Error creating role:', error);
      alert(error.response?.data?.message || 'Failed to create role');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div className="container">
        <div className="page-header">
          <h1>Job Role Management</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : 'Add Role'}
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h2>Add New Role</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Role Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows="3"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Create Role
              </button>
            </form>
          </div>
        )}

        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Department</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No roles found
                  </td>
                </tr>
              ) : (
                roles.map((role) => (
                  <tr key={role._id}>
                    <td>{role.title}</td>
                    <td>{role.department?.name || '-'}</td>
                    <td>{role.description || '-'}</td>
                    <td>
                      <span className="badge badge-success">Active</span>
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

export default Roles;
