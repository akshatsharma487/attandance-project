import User from '../models/User.js';

export const getAllEmployees = async (req, res) => {
  try {
    const { department, role, isActive, page = 1, limit = 20 } = req.query;

    const query = {};

    if (department) {
      query.department = department;
    }

    if (role) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const skip = (page - 1) * limit;

    const employees = await User.find(query)
      .populate('department')
      .populate('jobRole')
      .populate('manager', 'name email')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: employees,
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

export const getEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id)
      .populate('department')
      .populate('jobRole')
      .populate('manager', 'name email')
      .select('-password');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, role, department, jobRole, manager, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    const employeeId = `EMP${Date.now().toString().slice(-6)}`;

    const employee = await User.create({
      name,
      email,
      password,
      role: role || 'employee',
      department,
      jobRole,
      manager,
      employeeId,
      phone,
    });

    const newEmployee = await User.findById(employee._id)
      .populate('department')
      .populate('jobRole')
      .populate('manager', 'name email')
      .select('-password');

    res.status(201).json({
      success: true,
      data: newEmployee,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { name, email, role, department, jobRole, manager, phone, isActive } = req.body;

    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    if (name) employee.name = name;
    if (email) employee.email = email;
    if (role) employee.role = role;
    if (department) employee.department = department;
    if (jobRole) employee.jobRole = jobRole;
    if (manager) employee.manager = manager;
    if (phone) employee.phone = phone;
    if (isActive !== undefined) employee.isActive = isActive;

    await employee.save();

    const updatedEmployee = await User.findById(employee._id)
      .populate('department')
      .populate('jobRole')
      .populate('manager', 'name email')
      .select('-password');

    res.json({
      success: true,
      data: updatedEmployee,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    employee.isActive = false;
    await employee.save();

    res.json({
      success: true,
      message: 'Employee deactivated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyTeam = async (req, res) => {
  try {
    const teamMembers = await User.find({ manager: req.user._id })
      .populate('department')
      .populate('jobRole')
      .select('-password')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: teamMembers,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
