import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { leaveAPI } from '../utils/api';
import { format } from 'date-fns';
import './Leaves.css';

const Leaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'casual',
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const response = await leaveAPI.getMyLeaves();
      setLeaves(response.data.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await leaveAPI.applyLeave(formData);
      setShowForm(false);
      setFormData({
        leaveType: 'casual',
        startDate: '',
        endDate: '',
        reason: '',
      });
      fetchLeaves();
    } catch (error) {
      console.error('Error applying leave:', error);
      alert(error.response?.data?.message || 'Failed to apply leave');
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
          <h1>Leave Management</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
            {showForm ? 'Cancel' : 'Apply for Leave'}
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h2>Apply for Leave</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Leave Type</label>
                <select
                  value={formData.leaveType}
                  onChange={(e) =>
                    setFormData({ ...formData, leaveType: e.target.value })
                  }
                  required
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="half-day">Half Day</option>
                  <option value="early-leave">Early Leave</option>
                  <option value="work-from-home">Work From Home</option>
                  <option value="field-visit">Field Visit</option>
                </select>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  rows="4"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Submit Application
              </button>
            </form>
          </div>
        )}

        <div className="card">
          <h2>Leave History</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No leave records found
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td className="capitalize">{leave.leaveType.replace('-', ' ')}</td>
                    <td>{format(new Date(leave.startDate), 'dd MMM yyyy')}</td>
                    <td>{format(new Date(leave.endDate), 'dd MMM yyyy')}</td>
                    <td>{leave.totalDays}</td>
                    <td>{leave.reason}</td>
                    <td>
                      <span className={`badge badge-${getStatusClass(leave.status)}`}>
                        {leave.status}
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
    case 'approved':
      return 'success';
    case 'rejected':
      return 'danger';
    case 'pending':
      return 'warning';
    default:
      return 'secondary';
  }
};

export default Leaves;
