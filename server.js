
// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();
const app = express();

// Check required environment variables
if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in .env file');
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined in .env file');
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads') )

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI
  );
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit with failure
  }
};
connectDB();

// Routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/userRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes')
const depositRoutes = require('./src/routes/depositRoutes');
const withdrawalRoutes = require('./src/routes/withdrawalRoutes');
const creditBoxRoutes = require('./src/routes/creditCardBoxRoute')
const dashboardRoute = require('./src/routes/dashboardRoute');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes)
app.use('/api/boxes', creditBoxRoutes)
app.use('/api/deposits', depositRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/dashboard', dashboardRoute);

// Default route for server check
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

