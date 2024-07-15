// importing
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./database/db');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const acceptMultimedia = require('connect-multiparty');
const multer = require('multer');

// Making express app
const app = express();

// dotenv config
dotenv.config();

// cloudinary config
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// cors config to accept request from frontend
const corsOptions = {
    origin: true,
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions))

// mongodb connection
connectDB();

// Accepting json data
app.use(express.json());

// Accepting multipart/form-data
app.use(express.urlencoded({ extended: true }));

// creating test route
app.get("/test", (req,res) => {
    res.status(200).send("Hello");
})

//creating user routes
app.use('/api/user', require('./routes/userRoutes'))

const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);

app.use('/api/admin/events', require('./routes/adminEventRoutes'));

app.use('/api/favorites', require('./routes/favoritesRoutes'));

app.use("/api", require("./routes/authRoutes"))

app.use('/uploads', express.static('uploads'));

// Promo code routes
const promoCodeRoutes = require('./routes/promoCodeRoutes');
app.use('/api/promo-codes', promoCodeRoutes);

app.use('/api/venues', require('./routes/venueRoutes'));

app.use('/api/user/venuebookings', require('./routes/userVenueBookingRoutes'));

app.use('/api', require("./routes/checkoutRoutes"))

app.use('/api/notifications', require("./routes/notificationRoutes") )
// defining port
const PORT = process.env.PORT;
// run the server
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

// exporting app
module.exports = app;