const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const ArtisianRoutes = require('./routes/ArtisianRoutes');
const path = require('path');
const paymentRoutes = require('./routes/payment');
const app = express();
require('dotenv').config();

// app.use(cors({ origin: 'https://estorez.netlify.app/' })); 
const allowedOrigins =['https://estorez.netlify.app/'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

app.options('*', cors());

app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploads folder

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error:', error));

app.use('/api', productRoutes);
app.use('/api', ArtisianRoutes);
app.use('/api', paymentRoutes)
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
