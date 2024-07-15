const express = require("express");
const router = express.Router();
const venueBookingController = require("../controller/userVenueBookingController");
const { authGuard } = require('../middleware/authGuard');



router.post("/createBooking",  authGuard, venueBookingController.createVenueBooking);
router.get("/getBooking",authGuard,  venueBookingController.getAllVenueBookings);
router.get("/getBooking/:id",authGuard,  venueBookingController.getVenueBookingById);
router.put("/updateBooking/:id",authGuard,  venueBookingController.updateVenueBookingById);
router.delete("/deleteBooking/:id", authGuard, venueBookingController.deleteVenueBookingById);



module.exports = router;
