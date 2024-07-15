const Favorites = require('../model/favoritesModel');
const AdminEvent = require('../model/adminEventModel');
const mongoose = require('mongoose');

const toggleFavorite = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  if (!eventId) {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  try {
    const existingFavorite = await Favorites.findOne({ userId, eventId });

    if (existingFavorite) {
      await Favorites.findOneAndDelete({ userId, eventId });
      return res.status(200).json({ message: 'Favorite removed successfully', isFavorite: false });
    } else {
      const event = await AdminEvent.findById(eventId);

      if (!event) {
        return res.status(404).json({ error: 'Admin Event not found with the provided ID' });
      }

      const newFavorite = await Favorites.create({
        userId,
        eventId,
        adminEventName: event.adminEventName,
        ticketCount: event.ticketCount
      });

      return res.status(200).json({ message: 'Favorite added successfully', isFavorite: true, favorite: newFavorite });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to toggle favorite' });
  }
};

const getFavorites = async (req, res) => {
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const favorites = await Favorites.find({ userId }).populate('eventId');
    res.status(200).json({ favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

const removeFavorite = async (req, res) => {
  const eventId = req.params.eventId; // Extract eventId from route parameters
  const userId = req.user.id;

  if (!eventId) {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  try {
    // Use findOneAndDelete to find and delete the favorite
    const deletedFavorite = await Favorites.findOneAndDelete({ userId, eventId });

    if (!deletedFavorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};


const getFavoriteStatus = async (req, res) => {
  const { eventId } = req.query;
  const userId = req.user.id;

  if (!eventId) {
    return res.status(400).json({ error: 'Event ID is required' });
  }

  try {
    const favorite = await Favorites.findOne({ userId, eventId });
    res.status(200).json({ isFavorite: !!favorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch favorite status' });
  }
};

module.exports = {
  toggleFavorite,
  getFavorites,
  removeFavorite,
  getFavoriteStatus,
};
