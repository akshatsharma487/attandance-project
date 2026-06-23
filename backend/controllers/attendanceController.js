import Attendance from '../models/Attendance.js';
import { getStartOfDay, getEndOfDay, calculateHours } from '../utils/dateHelpers.js';

export const checkIn = async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;
    const today = getStartOfDay(new Date());

    const existingAttendance = await Attendance.findOne({
      user: req.user._id,
      date: today,
    });

    if (existingAttendance && existingAttendance.checkIn.time) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in today',
      });
    }

    const attendance = existingAttendance || new Attendance({
      user: req.user._id,
      date: today,
    });

    attendance.checkIn = {
      time: new Date(),
      location: {
        latitude,
        longitude,
        address,
      },
    };
    attendance.status = 'present';

    await attendance.save();

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkOut = async (req, res) => {
  try {
    const { latitude, longitude, address } = req.body;
    const today = getStartOfDay(new Date());

    const attendance = await Attendance.findOne({
      user: req.user._id,
      date: today,
    });

    if (!attendance || !attendance.checkIn.time) {
      return res.status(400).json({
        success: false,
        message: 'Please check in first',
      });
    }

    if (attendance.checkOut.time) {
      return res.status(400).json({
        success: false,
        message: 'Already checked out today',
      });
    }

    attendance.checkOut = {
      time: new Date(),
      location: {
        latitude,
        longitude,
        address,
      },
    };

    attendance.totalHours = calculateHours(attendance.checkIn.time, attendance.checkOut.time);

    await attendance.save();

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTodayAttendance = async (req, res) => {
  try {
    const today = getStartOfDay(new Date());

    const attendance = await Attendance.findOne({
      user: req.user._id,
      date: today,
    });

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyAttendanceHistory = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };

    if (startDate && endDate) {
      query.date = {
        $gte: getStartOfDay(new Date(startDate)),
        $lte: getEndOfDay(new Date(endDate)),
      };
    }

    const skip = (page - 1) * limit;

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Attendance.countDocuments(query);

    res.json({
      success: true,
      data: attendance,
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

export const getAllAttendance = async (req, res) => {
  try {
    const { date, status, page = 1, limit = 20 } = req.query;

    const query = {};

    if (date) {
      query.date = getStartOfDay(new Date(date));
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const attendance = await Attendance.find(query)
      .populate('user', 'name email employeeId department jobRole')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Attendance.countDocuments(query);

    res.json({
      success: true,
      data: attendance,
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

export const getTeamAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    const queryDate = date ? getStartOfDay(new Date(date)) : getStartOfDay(new Date());

    const User = (await import('../models/User.js')).default;
    const teamMembers = await User.find({ manager: req.user._id });

    const teamIds = teamMembers.map(member => member._id);

    const attendance = await Attendance.find({
      user: { $in: teamIds },
      date: queryDate,
    }).populate('user', 'name email employeeId department jobRole');

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
