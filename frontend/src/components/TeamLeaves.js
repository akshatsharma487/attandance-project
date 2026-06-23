import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { leaveAPI } from '../utils/api';
import { format } from 'date-fns';

const TeamLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchLeaves();
  }, [filter]);

  const fetchLeaves = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await leaveAPI.getTeamLeaves(params);
      setLeaves(response.data.data);
    } catch (error) {
      console.error('Error fetching team leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await leaveAPI.approveLeave(id);
      fetchLeaves();
    } catch (error) {
      console.error('Error approving leave:', error);
      alert('Failed to approve leave');
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await leaveAPI.rejectLeave(id, { rejectionReason: reason });
      fetchLeaves();
    } catch (error) {
      console.error('Error rejecting leave:', error);
      alert('Failed to reject leave');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Team Leave Requests</h1>

        <div className="card">
          <div className="form-group">
            <label>Filter by Status</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
                    No leave requests found
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave._id}>
                    <td>{leave.user?.name}</td>
                    <td className="capitalize">
                      {leave.leaveType.replace('-', ' ')}
                    </td>
                    <td>{format(new Date(leave.startDate), 'dd MMM yyyy')}</td>
                    <td>{format(new Date(leave.endDate), 'dd MMM yyyy')}</td>
                    <td>{leave.totalDays}</td>
                    <td>{leave.reason}</td>
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
                    <td>
                      {leave.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            onClick={() => handleApprove(leave._id)}
                            className="btn btn-success"
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(leave._id)}
                            className="btn btn-danger"
                            style={{ padding: '5px 10px', fontSize: '12px' }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
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

export default TeamLeaves;
