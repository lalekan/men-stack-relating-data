const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/user.js');
const Food = require('../models/food.js');

// Route to render the new food form
router.get('/new', (req, res) => {
  if (!req.user) {
    console.error('User is not defined. Cannot access new food page.');
    return res.redirect('/auth/sign-in'); 
  }

  console.log('Accessing create new food page for user:', req.user._id);

  const userId = req.params.userId
  
  res.render('foods/new', { userId: userId });
});

// Route to handle food creation
router.post('/', async (req, res) => {
  const userId = req.user._id; 
  console.log('Creating food for User ID:', userId);

  try {
    const foodItem = new Food({
      name: req.body.name,
      calories: req.body.calories,
      expirationDate: req.body.expirationDate,
    });

    await foodItem.save();

    const user = await User.findById(userId);
    user.pantry.push(foodItem._id);
    await user.save();

    res.redirect(`/users/${userId}/foods`);
  } catch (error) {
    console.error('Error creating food item:', error);
    res.status(500).send('Server error');
  }
});

// Route to fetch food items for the user's pantry
router.get('/', async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    const foods = await Food.find({ _id: { $in: user.pantry } });
    res.render('foods/index.ejs', { food: foods });
  } catch (error) {
    console.error('Error fetching food:', error);
    res.status(500).send('Server Error');
  }
});

// Invalid route handling
router.get('*', (req, res) => {
  console.log('Invalid Route Accessed:', req.originalUrl);
  res.status(404).send('Not Found');
});

module.exports = router;
