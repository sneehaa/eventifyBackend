const VenueBooking = require('../model/venueBookingModel');

// Controller functions

// Create a new venue booking
const createVenueBooking = async (req, res) => {
  try {
    const venueBooking = new VenueBooking(req.body);
    await venueBooking.save();
    res.status(201).json(venueBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all venue bookings
const getAllVenueBookings = async (req, res) => {
  try {
    const venueBookings = await VenueBooking.find().exec();
    res.json(venueBookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single venue booking by ID
const getVenueBookingById = async (req, res) => {
  try {
    const venueBooking = await VenueBooking.findById(req.params.id).exec();
    if (!venueBooking) {
      return res.status(404).json({ message: 'Venue booking not found' });
    }
    res.json(venueBooking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a venue booking by ID
const updateVenueBookingById = async (req, res) => {
  try {
    const venueBooking = await VenueBooking.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
    if (!venueBooking) {
      return res.status(404).json({ message: 'Venue booking not found' });
    }
    res.json(venueBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a venue booking by ID
const deleteVenueBookingById = async (req, res) => {
  try {
    const venueBooking = await VenueBooking.findByIdAndDelete(req.params.id).exec();
    if (!venueBooking) {
      return res.status(404).json({ message: 'Venue booking not found' });
    }
    res.json({ message: 'Venue booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
    createVenueBooking,
    getAllVenueBookings,
    getVenueBookingById,
    updateVenueBookingById,
    deleteVenueBookingById,
}