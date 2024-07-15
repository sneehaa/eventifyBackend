const Events = require('../model/eventModel');
const mongoose = require('mongoose');


const createEvent = async (req, res) => {
  try {
    const { eventName, eventDate, eventTime, location, ticketPrice } = req.body;
    let images = [];

    console.log("Create Event: req.user:", req.user); // Log the req.user object

    const { id: userId } = req.user; // Ensure the correct property is accessed

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access. Please login again.',
      });
    }

    if (req.files && Array.isArray(req.files)) {
      images = req.files.map(file => file.path);
    }

    if (!eventName || !eventDate || !eventTime || !location || !ticketPrice) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields.',
      });
    }

    const newEvent = new Events({
      eventName,
      eventDate,
      eventTime,
      location,
      ticketPrice,
      images,
      createdBy: userId, 
    });

    await newEvent.save();
    res.status(201).json({
      success: true,
      message: 'Event created successfully.',
      event: newEvent,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};



const getAllEvents = async (req, res) => {
  try {
    const userId = req.query.userId;

    let events;
    if (userId) {
      events = await Events.find({ createdBy: userId });
    } else {
      events = await Events.find();
    }

    const eventsWithImageUrl = events.map(event => {
      event.images = event.images.map(image => `http://192.168.68.109:5500/uploads/${image}`);
      return event;
    });

    res.status(200).json({
      success: true,
      message: 'Events fetched successfully.',
      events: eventsWithImageUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const getUserEvents = async (req, res) => {
  try {
    const userId = req.params.userId;
    const events = await Events.find({ createdBy: userId });
    res.status(200).json({
      success: true,
      message: 'Events fetched successfully.',
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Event ID.',
      });
    }

    const event = await Events.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    event.images = event.images.map(image => `http://192.168.68.109:5500/uploads/${image}`);

    res.status(200).json({
      success: true,
      message: 'Event fetched successfully.',
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};


// UpeventDate an event
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const updatedData = req.body;

    const event = await Events.findByIdAndUpdate(eventId, updatedData, { new: true });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully.',
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const event = await Events.findByIdAndDelete(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully.',
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
  createEvent,
  getAllEvents,
  getEventById,
  getUserEvents,
  updateEvent,
  deleteEvent,
};
