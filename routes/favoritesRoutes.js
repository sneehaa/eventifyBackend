const express = require('express');
const router = express.Router();
const favoritesController = require('../controller/favoritesController');
const { authGuard } = require('../middleware/authGuard');

router.post('/toggleFavorite', authGuard, favoritesController.toggleFavorite);

router.get('/getFavorites', authGuard, favoritesController.getFavorites);

router.delete('/removeFavorite/:eventId', authGuard, favoritesController.removeFavorite);

router.get('/getFavoriteStatus', authGuard, favoritesController.getFavoriteStatus);

module.exports = router;
