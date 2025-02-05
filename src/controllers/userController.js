const mongoose = require('mongoose');
const User = require('../models/userModel'); 

exports.getUserDetails = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'فرمت userId نامعتبر است' });
  }

  try {
    const user = await User.findById(userId).select('-password'); 
    if (!user) {
      return res.status(404).json({ message: 'کاربر با این شناسه پیدا نشد' });
    }

    res.status(200).json({ message: 'جزئیات کاربر با موفقیت بازیابی شد', user });
  } catch (error) {
    console.error('Error while fetching user details:', error);
    res.status(500).json({ message: 'خطای داخلی سرور' });
  }
};
