const mongoose = require('mongoose');

const venueBookingSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  venueName: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  promoCode: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const VenueBooking = mongoose.model('venueBooking', venueBookingSchema);

module.exports = VenueBooking;
