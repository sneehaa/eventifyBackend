//importing

const express = require('express');
const router = express.Router();
const userController = require("../controller/userController");


//creating user api
router.post('/register', userController.register);

//creating login api
router.post('/login', userController.loginUser);

module.exports = router;