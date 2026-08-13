const User = require('../models/User');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, pinCode, employeeId, role, isActive } = req.body;

    // Basic validation
    if (!name || !pinCode || !employeeId) {
      return res.status(400).json({ message: 'Name, Employee ID, and PIN code are required' });
    }

    // Check for duplicate employeeId
    const existingEmployee = await User.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(400).json({ message: 'This Employee ID is already in use by another user' });
    }

    const user = await User.create({
      name,
      employeeId,
      pinCode,
      role: role || 'Cashier',
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, pinCode, employeeId, role, isActive } = req.body;
    const userId = req.params.id;

    // Check if new employeeId is already used by someone else
    if (employeeId) {
      const existingEmployee = await User.findOne({ employeeId, _id: { $ne: userId } });
      if (existingEmployee) {
        return res.status(400).json({ message: 'This Employee ID is already in use' });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, pinCode, employeeId, role, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { employeeId, pinCode } = req.body;

    if (!employeeId || !pinCode) {
      return res.status(400).json({ message: 'Employee ID and PIN code are required' });
    }

    const user = await User.findOne({ employeeId });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.pinCode !== pinCode) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    if (user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    // Return user without pinCode
    const userResponse = {
      _id: user._id,
      name: user.name,
      employeeId: user.employeeId,
      role: user.role,
      isActive: user.isActive
    };

    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

