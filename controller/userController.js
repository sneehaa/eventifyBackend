const Users = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  console.log(req.body);

  const { fullName, userName, password, confirmPassword, phoneNumber } = req.body;

  if (!fullName || !userName || !password || !confirmPassword || !phoneNumber) {
    return res.json({
      success: false,
      message: 'Please enter all the fields.',
    });
  }

  try {
    const existingUser = await Users.findOne({ userName });
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
      userName,
      password: encryptedPassword,
      confirmPassword: encryptedPassword,
      phoneNumber,
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

  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.json({
      success: false,
      message: 'Please enter all fields.',
    });
  }

  try {
    const user = await Users.findOne({ userName });
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
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET
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

module.exports = {
  register,
  loginUser,
  getAllUsers,
};
