import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import { getStartOfDay, getEndOfDay } from '../utils/dateHelpers.js';

export const getAdminDashboard = async (req, res) => {
  try {
    const today = getStartOfDay(new Date());

    const totalEmployees = await User.countDocuments({ role: 'employee', isActive: true });

    const todayAttendance = await Attendance.find({
      date: today,
      status: 'present',
    }).countDocuments();

    const todayLeaves = await Leave.find({
      startDate: { $lte: today },
      endDate: { $gte: today },
      status: 'approved',
    }).countDocuments();

    const absentEmployees = totalEmployees - todayAttendance - todayLeaves;

    const pendingLeaves = await Leave.countDocuments({ status: 'pending' });

    const recentAttendance = await Attendance.find({ date: today })
      .populate('user', 'name email employeeId')
      .sort({ 'checkIn.time': -1 })
      .limit(10);

    const recentLeaves = await Leave.find()
      .populate('user', 'name email employeeId')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        stats: {
          totalEmployees,
          presentToday: todayAttendance,
          absentToday: absentEmployees,
          onLeaveToday: todayLeaves,
          pendingLeaves,
        },
        recentAttendance,
        recentLeaves,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getManagerDashboard = async (req, res) => {
  try {
    const today = getStartOfDay(new Date());

    const teamMembers = await User.find({ manager: req.user._id, isActive: true });
    const teamIds = teamMembers.map(member => member._id);

    const totalTeamMembers = teamIds.length;

    const todayAttendance = await Attendance.find({
      user: { $in: teamIds },
      date: today,
      status: 'present',
    }).countDocuments();

    const todayLeaves = await Leave.find({
      user: { $in: teamIds },
      startDate: { $lte: today },
      endDate: { $gte: today },
      status: 'approved',
    }).countDocuments();

    const absentMembers = totalTeamMembers - todayAttendance - todayLeaves;

    const pendingLeaves = await Leave.countDocuments({
      user: { $in: teamIds },
      status: 'pending',
    });

    const recentAttendance = await Attendance.find({
      user: { $in: teamIds },
      date: today,
    })
      .populate('user', 'name email employeeId')
      .sort({ 'checkIn.time': -1 })
      .limit(10);

    const recentLeaves = await Leave.find({
      user: { $in: teamIds },
    })
      .populate('user', 'name email employeeId')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        stats: {
          totalTeamMembers,
          presentToday: todayAttendance,
          absentToday: absentMembers,
          onLeaveToday: todayLeaves,
          pendingLeaves,
        },
        recentAttendance,
        recentLeaves,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEmployeeDashboard = async (req, res) => {
  try {
    const today = getStartOfDay(new Date());

    const todayAttendance = await Attendance.findOne({
      user: req.user._id,
      date: today,
    });

    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const monthlyAttendance = await Attendance.find({
      user: req.user._id,
      date: { $gte: currentMonthStart, $lte: currentMonthEnd },
      status: 'present',
    }).countDocuments();

    const totalLeaveTaken = await Leave.aggregate([
      {
        $match: {
          user: req.user._id,
          status: 'approved',
          startDate: { $gte: currentMonthStart },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalDays' },
        },
      },
    ]);

    const pendingLeaves = await Leave.countDocuments({
      user: req.user._id,
      status: 'pending',
    });

    res.json({
      success: true,
      data: {
        todayAttendance,
        stats: {
          monthlyAttendance,
          totalLeaveTaken: totalLeaveTaken[0]?.total || 0,
          pendingLeaves,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
