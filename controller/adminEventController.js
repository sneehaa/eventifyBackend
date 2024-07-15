const AdminEvent = require("../model/adminEventModel");
const mongoose = require("mongoose");

const createAdminEvent = async (req, res) => {
  try {
    const {
      adminEventName,
      adminEventDate,
      adminEventTime,
      adminLocation,
      adminGeneralPrice,
      adminFanpitPrice,
      adminVipPrice,
    } = req.body;
    let images = [];

    const { userId } = req.user;

    if (req.files && Array.isArray(req.files)) {
      images = req.files.map((file) => file.path);
    }

    if (
      !adminEventName ||
      !adminEventDate ||
      !adminEventTime ||
      !adminLocation ||
      !adminGeneralPrice ||
      !adminFanpitPrice ||
      !adminVipPrice
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    const newEvent = new AdminEvent({
      adminEventName,
      adminEventDate,
      adminEventTime,
      adminLocation,
      adminGeneralPrice,
      adminFanpitPrice,
      adminVipPrice,
      adminImages: images,
      adminCreatedBy: userId, // Store admin ID who created the event
    });

    await newEvent.save();
    res.status(201).json({
      success: true,
      message: "Event created successfully.",
      event: newEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getAllAdminEvents = async (req, res) => {
  try {
    const events = await AdminEvent.find();

    const eventsWithImageUrl = events.map((event) => {
  event.adminImages = event.adminImages.map(
    (image) => `http://192.168.68.109:5500/uploads/${image}`
  );
  return event;
});

    res.status(200).json({
      success: true,
      message: "Admin Events fetched successfully.",
      events: eventsWithImageUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const getAdminEventById = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Event ID.",
      });
    }

    const event = await AdminEvent.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    event.adminImages = event.adminImages.map(
      (image) => `http://192.168.68.109:5500/uploads/${image}`
    );

    res.status(200).json({
      success: true,
      message: "Admin Event fetched successfully.",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const updateAdminEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const updatedData = req.body;

    const event = await AdminEvent.findByIdAndUpdate(eventId, updatedData, {
      new: true,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const deleteAdminEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const event = await AdminEvent.findByIdAndDelete(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
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
  createAdminEvent,
  getAllAdminEvents,
  getAdminEventById,
  updateAdminEvent,
  deleteAdminEvent,
};
