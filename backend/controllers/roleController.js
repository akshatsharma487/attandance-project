import JobRole from '../models/JobRole.js';

export const getAllRoles = async (req, res) => {
  try {
    const { department } = req.query;
    const query = { isActive: true };

    if (department) {
      query.department = department;
    }

    const roles = await JobRole.find(query).populate('department').sort({ title: 1 });

    res.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRole = async (req, res) => {
  try {
    const role = await JobRole.findById(req.params.id).populate('department');

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    res.json({
      success: true,
      data: role,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const createRole = async (req, res) => {
  try {
    const { title, description, department } = req.body;

    const role = await JobRole.create({
      title,
      description,
      department,
    });

    const newRole = await JobRole.findById(role._id).populate('department');

    res.status(201).json({
      success: true,
      data: newRole,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { title, description, department, isActive } = req.body;

    const role = await JobRole.findByIdAndUpdate(
      req.params.id,
      { title, description, department, isActive },
      { new: true, runValidators: true }
    ).populate('department');

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    res.json({
      success: true,
      data: role,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const role = await JobRole.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    role.isActive = false;
    await role.save();

    res.json({
      success: true,
      message: 'Role deactivated successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
