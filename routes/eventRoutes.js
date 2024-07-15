const express = require('express');
const router = express.Router();
const eventController = require("../controller/eventController");
const upload = require('../multer_config'); 
const { authGuard} = require("../middleware/authGuard");

router.post('/create', upload.array('images', 12), authGuard, eventController.createEvent);

router.get('/getevents', authGuard, eventController.getAllEvents);
router.get('/user/:userId', authGuard, eventController.getUserEvents);

router.get('/:eventId', authGuard, eventController.getEventById);

router.put('/:eventId', authGuard, eventController.updateEvent);

router.delete('/:eventId',authGuard,  eventController.deleteEvent);

module.exports = router;