const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  ticketDetails: [
    {
      name: {
        type: String,
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Checkout = mongoose.model('Checkout', checkoutSchema);

module.exports = Checkout;
