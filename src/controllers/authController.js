const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Signup Handler
exports.signup = async (req, res) => {
  console.log('Signup request received:', req.body);

  const { nationalCode, email, password } = req.body;

  if (!nationalCode || !email || !password) {
    console.log('Missing fields in signup request');
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Create new user
    const newUser = new User({
      nationalCode,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log('New user registered:', newUser);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Login Handler
exports.login = async (req, res) => {
    console.log('Login request received:', req.body);
  
    const { email, password } = req.body;
  
    if (!email || !password) {
      console.log('Missing email or password in login request');
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        console.log('User not found:', email);
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if password matches
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET, // Add this secret key to your .env file
        { expiresIn: '1h' } // Token expiry time
      );
  
      console.log('User logged in successfully:', email);
  
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          completedProfile: user.completedProfile,
        },
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

// Profile Update Handler
exports.updateProfile = async (req, res) => {
    console.log('Profile update request received:', req.body);
  
    const { userId, firstName, lastName, birthDate, mobile } = req.body;
  
    // Check for missing fields
    if (!userId || !firstName || !lastName || !birthDate || !mobile) {
      console.log('Missing fields in profile update request:', { userId, firstName, lastName, birthDate, mobile });
      return res.status(400).json({ message: 'All fields are required to update profile' });
    }
  
    // Ensure userId is a string
    const cleanedUserId = String(userId).trim();
    console.log('Type of userId:', typeof cleanedUserId);
    console.log('Is userId valid hex:', /^[0-9a-fA-F]{24}$/.test(cleanedUserId));
  
    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(cleanedUserId)) {
      console.log('Invalid userId format after trimming:', cleanedUserId);
      return res.status(400).json({ message: 'Invalid userId format' });
    }
  
    const objectId = new mongoose.Types.ObjectId(cleanedUserId); // Convert to ObjectId
  
    // Validate birthDate and mobile number
    if (isNaN(Date.parse(birthDate))) {
      console.log('Invalid birthDate format:', birthDate);
      return res.status(400).json({ message: 'Invalid birthDate format. Use YYYY-MM-DD' });
    }
    if (!/^\d{10}$/.test(mobile)) {
      console.log('Invalid mobile number:', mobile);
      return res.status(400).json({ message: 'Mobile number must be 10 digits' });
    }
  
    try {
      // Find user by ID
      const user = await User.findById(objectId);
      if (!user) {
        console.log('User not found with ID:', cleanedUserId);
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user fields
      user.firstName = firstName;
      user.lastName = lastName;
      user.birthDate = new Date(birthDate);
      user.mobile = mobile.toString(); // Ensure mobile is stored as a string
      user.completedProfile = true;
  
      await user.save();
  
      console.log('User profile updated successfully:', user);
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
      console.error('Error during profile update:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};



exports.logout = (req, res) => {
  // No server-side action required for logout when using token expiration
  console.log('Logout request received');
  res.status(200).json({ message: 'Logout successful. Please remove the token on the client side.' });
};

  