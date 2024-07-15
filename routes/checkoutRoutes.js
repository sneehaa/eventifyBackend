const express = require('express');
const router = express.Router();
const checkoutController = require('../controller/checkoutController');

// POST request for checkout
router.post('/checkout', checkoutController.checkoutProcess);

module.exports = router;
