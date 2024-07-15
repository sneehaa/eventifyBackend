
const express = require('express');
const router = express.Router();
const promoCodeController = require('../controller/promoCodeController');
const { authGuard, authGuardAdmin } = require('../middleware/authGuard');

// Create a new promo code
router.post('/create', promoCodeController.createPromoCode);

// Get all promo codes
router.get('/',  authGuard, promoCodeController.getAllPromoCodes);

// Get a promo code by ID
router.get('/:id', authGuard, authGuardAdmin, promoCodeController.getPromoCodeById);

// Update a promo code by ID
router.put('/:id', authGuard, authGuardAdmin, promoCodeController.updatePromoCode);

// Delete a promo code by ID
router.delete('/:id', authGuard, authGuardAdmin, promoCodeController.deletePromoCode);



module.exports = router;
