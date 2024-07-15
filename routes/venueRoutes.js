
const express = require('express');
const router = express.Router();
const venueController = require ("../controller/venueController");
const { authGuard, authGuardAdmin } = require('../middleware/authGuard');
const upload = require('../multer_config').single('image'); 

// Apply promo code
router.post('/apply_promo_code', venueController.applyPromoCode);

// Book venue
router.post('/book-venue', venueController.bookVenue);

// Approve booking
router.post('/approve_booking' ,authGuard, authGuardAdmin ,venueController.approveBooking);

// Create venue (admin only)
router.post('/create-venue', upload, authGuard, authGuardAdmin, venueController.createVenue);


router.get("/locations" ,authGuard, venueController.location);

router.get("/getVenues", authGuard, venueController.getVenues);

module.exports = router;

