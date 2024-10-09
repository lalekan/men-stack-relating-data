const express = require('express');
const User = require('../models/user'); 
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const users = await User.find(); 
    res.render('users/community.ejs', { users }); 
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

router.get('/:userId/pantry', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const user = await User.findById(userId).populate('pantry'); 
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      res.render('users/pantry', { user, foods: user.pantry });
    } catch (error) {
      console.error('Error fetching user pantry:', error);
      res.status(500).send('Server Error');
    }
  });
  