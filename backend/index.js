const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const ArtisianRoutes = require('./routes/ArtisianRoutes');
const paymentRoutes = require('./routes/payment');
const path = require('path');
require('dotenv').config();

const app = express();

const allowedOrigins = ['https://estorez.netlify.app']; // Corrected origin (no trailing slash)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploads folder

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error:', error));

app.use('/api', productRoutes);
app.use('/api', ArtisianRoutes);
app.use('/api', paymentRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
