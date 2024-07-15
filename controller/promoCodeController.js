const PromoCode = require('../model/promoCodeModel');

// Create a new promo code
const createPromoCode = async (req, res) => {
  try {
    const { code, discount, expirationDate } = req.body;

    if (!code || !discount || !expirationDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.',
      });
    }

    const newPromoCode = new PromoCode({
      code,
      discount,
      expirationDate,
    });

    await newPromoCode.save();
    res.status(201).json({
      success: true,
      message: 'Promo code created successfully.',
      promoCode: newPromoCode,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get all promo codes
const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.status(200).json({
      success: true,
      message: 'Promo codes fetched successfully.',
      promoCodes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Get a promo code by ID
const getPromoCodeById = async (req, res) => {
  try {
    const promoCodeId = req.params.id;
    const promoCode = await PromoCode.findById(promoCodeId);

    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Promo code fetched successfully.',
      promoCode,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Update a promo code by ID
const updatePromoCode = async (req, res) => {
  try {
    const promoCodeId = req.params.id;
    const { code, discount, expirationDate } = req.body;

    const updatedPromoCode = await PromoCode.findByIdAndUpdate(
      promoCodeId,
      { code, discount, expirationDate },
      { new: true }
    );

    if (!updatedPromoCode) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Promo code updated successfully.',
      promoCode: updatedPromoCode,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Delete a promo code by ID
const deletePromoCode = async (req, res) => {
  try {
    const promoCodeId = req.params.id;

    const deletedPromoCode = await PromoCode.findByIdAndDelete(promoCodeId);

    if (!deletedPromoCode) {
      return res.status(404).json({
        success: false,
        message: 'Promo code not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Promo code deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

module.exports = {
  createPromoCode,
  getAllPromoCodes,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode,
};
