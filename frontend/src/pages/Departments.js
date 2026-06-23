import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { departmentAPI } from '../utils/api';
import './Management.css';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getAllDepartments();
      setDepartments(response.data.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await departmentAPI.createDepartment(formData);
      setShowForm(false);
      setFormData({ name: '', description: '' });
      fetchDepartments();
    } catch (error) {
      console.error('Error creating department:', error);
      alert(error.response?.data?.message || 'Failed to create department');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Department Management</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : 'Add Department'}
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h2>Add New Department</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Department Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
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
                Create Department
              </button>
            </form>
          </div>
        )}

        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {departments.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    No departments found
                  </td>
                </tr>
              ) : (
                departments.map((dept) => (
                  <tr key={dept._id}>
                    <td>{dept.name}</td>
                    <td>{dept.description || '-'}</td>
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

export default Departments;
