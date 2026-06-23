import Leave from '../models/Leave.js';
import { calculateLeaveDays } from '../utils/dateHelpers.js';

export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    const totalDays = calculateLeaveDays(startDate, endDate);

    const leave = await Leave.create({
      user: req.user._id,
      leaveType,
      startDate,
      endDate,
      reason,
      totalDays,
    });

    res.status(201).json({
      success: true,
      data: leave,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const leaves = await Leave.find(query)
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Leave.countDocuments(query);

    res.json({
      success: true,
      data: leaves,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTeamLeaves = async (req, res) => {
  try {
    const { status } = req.query;

    const User = (await import('../models/User.js')).default;
    const teamMembers = await User.find({ manager: req.user._id });
    const teamIds = teamMembers.map(member => member._id);

    const query = { user: { $in: teamIds } };

    if (status) {
      query.status = status;
    }

    const leaves = await Leave.find(query)
      .populate('user', 'name email employeeId department')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: leaves,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllLeaves = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const leaves = await Leave.find(query)
      .populate('user', 'name email employeeId department')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Leave.countDocuments(query);

    res.json({
      success: true,
      data: leaves,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;

    const leave = await Leave.findById(id).populate('user');

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found',
      });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Leave already processed',
      });
    }

    leave.status = 'approved';
    leave.approvedBy = req.user._id;
    leave.approvalDate = new Date();

    await leave.save();

    res.json({
      success: true,
      data: leave,
      message: 'Leave approved successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    const leave = await Leave.findById(id);

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave not found',
      });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Leave already processed',
      });
    }

    leave.status = 'rejected';
    leave.approvedBy = req.user._id;
    leave.approvalDate = new Date();
    leave.rejectionReason = rejectionReason;

    await leave.save();

    res.json({
      success: true,
      data: leave,
      message: 'Leave rejected successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
