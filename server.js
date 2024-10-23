const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 60000,  // Time in ms before Mongoose gives up trying to connect
  socketTimeoutMS: 45000,           // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 60000,          // Time in ms to allow Mongoose to establish a connection
  maxPoolSize: 10,                  // Limit the connection pool to 10 connections
  family: 4,                        // Use IPv4, skip trying to resolve IPv6
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Import routes
const userRoutes = require('./Routes/authentication');
const projectRoutes = require('./Routes/investor');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// Error handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
