const mongoose = require('mongoose');
const User = require('../models/userModel'); // Adjust path to your user model

// Get User Details
exports.getUserDetails = async (req, res) => {
  const { userId } = req.params;

  console.log('Get user details request received for userId:', userId);

  // Validate and convert userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.log('Invalid userId format:', userId);
    return res.status(400).json({ message: 'Invalid userId format' });
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId).select('-password'); // Exclude password from the response
    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User details retrieved successfully:', user);
    res.status(200).json({ message: 'User details retrieved successfully', user });
  } catch (error) {
    console.error('Error while fetching user details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
