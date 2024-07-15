// favoritesModel.js
const mongoose = require('mongoose');

const favoritesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminEvent',
    required: true
  },
  adminEventName: {
    type: String,
    required: true
  },
});

const Favorites = mongoose.model('Favorites', favoritesSchema);

module.exports = Favorites;
