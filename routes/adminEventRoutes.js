const express = require("express");
const router = express.Router();
const admineventController = require("../controller/adminEventController");
const { authGuard, authGuardAdmin } = require("../middleware/authGuard");
const upload = require("../multer_config");

// Create admin event
router.post(
  "/create",
  upload.array("images", 12),
  authGuard,
  authGuardAdmin,
  admineventController.createAdminEvent
);

// Get all admin events
router.get(
  "/getAll",
  admineventController.getAllAdminEvents
);

// Get admin event by ID
router.get(
  "/:eventId",
  admineventController.getAdminEventById
);

// Update admin event
router.put(
  "/update/:eventId",
  authGuard,
  authGuardAdmin,
  admineventController.updateAdminEvent
);

// Delete admin event
router.delete(
  "/delete/:eventId",
  authGuard,
  authGuardAdmin,
  admineventController.deleteAdminEvent
);

// Upload image
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send({ imagePath: `/uploads/${req.file.filename}` });
});

module.exports = router;
