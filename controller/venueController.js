const Venue = require("../model/venueModel.js");
const VenueBooking = require("../model/venueBookingModel.js");
const PromoCode = require("../model/promoCodeModel.js");
const upload = require("../multer_config.js");

const createVenue = async (req, res) => {
  try {
    const { name, location, price } = req.body;
    let images = [];

    if (req.file) {
      images.push(req.file.path);
    } else if (req.files && Array.isArray(req.files)) {
      images = req.files.map((file) => file.path);
    }

    if (!name || !location || !price) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const newVenue = new Venue({
      name,
      location,
      price,
      images,
    });

    await newVenue.save();
    res.status(201).json({
      success: true,
      message: "Venue created successfully.",
      venue: newVenue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Apply promo code
const applyPromoCode = async (req, res) => {
  try {
    const { promoCode } = req.body;
    const code = await PromoCode.findOne({ code: promoCode });

    if (!code) {
      return res
        .status(404)
        .json({ success: false, message: "Promo code not found" });
    }
    const discountedPrice = calculateDiscountedPrice(code);

    return res.status(200).json({ success: true, discountedPrice });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Book venue
const bookVenue = async (req, res) => {
  try {
    const { location, venueName, date, time, price, promoCode } = req.body;

    if (!location || !venueName || !date || !time || !price) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const newBooking = new VenueBooking({
      location,
      venueName,
      date,
      time,
      price,
      promoCode,
      status: "pending",
    });

    await newBooking.save();

    return res.status(201).json({
      success: true,
      message: "Booking request sent, waiting for approval",
      booking: newBooking,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Approve booking
const approveBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await VenueBooking.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    booking.status = "approved";
    await booking.save();

    return res
      .status(200)
      .json({ success: true, message: "Booking approved", booking });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const location = async (req, res) => {
  try {
    const uniqueLocations = await Venue.find({}, "location")
      .exec()
      .then((locations) =>
        locations
          .map((location) => location.location)
          .filter((value, index, self) => self.indexOf(value) === index)
      );
    res.status(200).json(uniqueLocations);
  } catch (err) {
    console.error("Error fetching locations:", err);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
};

const getVenues = async (req, res) => {
  try {
    const venues = await Venue.find();
    res.status(200).json({
      success: true,
      venues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
module.exports = {
  createVenue,
  applyPromoCode,
  bookVenue,
  approveBooking,
  location,
  getVenues
};
