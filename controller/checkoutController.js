// checkoutController.js

const Checkout = require('../model/checkoutModel');

// Controller function for handling checkout process
const checkoutProcess = async (req, res) => {
  try {
    // Extract data from request body
    const { fullName, phoneNumber, ticketDetails } = req.body;

    // Calculate total payable amount
    let totalAmount = 0;
    const ticketSummary = [];

    ticketDetails.forEach(ticket => {
      const { name, count, price } = ticket;
      const subtotal = count * price;
      totalAmount += subtotal;
      ticketSummary.push(`${count} ${name} x Rs. ${price} = Rs. ${subtotal}`);
    });

    // Create new checkout document
    const newCheckout = new Checkout({
      fullName,
      phoneNumber,
      ticketDetails,
    });

    // Save to database
    await newCheckout.save();

    // Prepare response
    const response = {
      fullName,
      phoneNumber,
      ticketSummary,
      totalAmount,
    };

    // Send response back to client
    res.json(response);
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  checkoutProcess,
};
