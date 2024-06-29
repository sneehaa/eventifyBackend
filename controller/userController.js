const Users = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  console.log(req.body);

  const { fullName, username, phoneNumber, password, confirmPassword, role, permissions } = req.body;

  if (!fullName ||!username ||!phoneNumber ||!password ||!confirmPassword) {
    return res.json({
      success: false,
      message: 'Please enter all the fields.',
    });
  }

  try {
    const existingUser = await Users.findOne({ username });
    if (existingUser) {
      return res.json({
        success: false,
        message: 'User already exists.',
      });
    }

    const randomSalt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, randomSalt);

    const newUser = new Users({
      fullName,
      username,
      phoneNumber,
      password: encryptedPassword,
      confirmPassword: encryptedPassword,
      role: role || 'user', // default role for new users
      permissions: permissions || ['read', 'write'], // default permissions for new users
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: 'User created successfully.',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json('Server Error');
  }
};

const loginUser = async (req, res) => {
  console.log(req.body);

  const { username, password } = req.body;

  if (!username ||!password) {
    return res.json({
      success: false,
      message: 'Please enter all fields.',
    });
  }

  try {
    const user = await Users.findOne({ username });
    if (!user) {
      return res.json({
        success: false,
        message: 'User does not exist.',
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.json({
        success: false,
        message: 'Invalid Credentials.',
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        role: user.role,
        permissions: user.permissions,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h', // token expires in 1 hour
      }
    );

    res.status(200).json({
      success: true,
      message: 'User logged in successfully.',
      token,
      userData: user,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const users = await Users.find({}).skip(skip).limit(limit);

    res.status(200).json({
      success: true,
      message: 'All users fetched successfully.',
      count: users.length,
      page,
      limit,
      users,
    });
  } catch (error) {
    res.json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    // Extract user ID from the request
    const userId = req.params.userId;

    // Fetch the user's profile data based on the user ID
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Exclude the password field from the user object
    const userProfile = {...user.toObject() };
    delete userProfile.password;

    // Return user profile data without the password
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully.",
      userProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


// edit user profile
const editUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update specific fields
    user.fullName = req.body.fullName;
    user.username = req.body.username;
    user.phoneNumber = req.body.phoneNumber;
    user.gender = req.body.gender;
    user.location = req.body.location;

    // Save the updated user profile
    await user.save();

    res.status(200).json({
      success: true,
      message: "User profile updated successfully.",
      updatedUserProfile: user, // Return the updated user object
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//User Profile Function
const userProfile = async (req, res, next) => {
  const user = await Users.findOne(req.user.id).select("-password");
  console.log(user, "User");
  res.status(200).json({
    success: true,
    user,
  });
};

//delete user profile
const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user exists
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Delete the user
    await Users.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};


module.exports = {
  register,
  loginUser,
  getAllUsers,
  getUserProfile,
  userProfile,
  editUserProfile,
  deleteUserAccount
};