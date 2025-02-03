const {CreditCardBox} = require('../models/creditCardBoxModel');

// Get Total Money from All Boxes
exports.getTotalMoney = async (req, res) => {
   try {
      // Fetch all boxes
      const boxes = await CreditCardBox.find();

      // Calculate the total sum of all box balances
      const totalMoney = boxes.reduce((sum, box) => sum + box.initialAmount, 0);

      res.status(200).json({ totalMoney });
   } catch (error) {
      console.error('Error fetching total money:', error);
      res.status(500).json({ message: 'Internal server error' });
   }
};
