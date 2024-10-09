const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require('../models/user.js');
const Food = require('../models/food.js');


router.get('/new', (req, res) => {
  if (!req.user) {
    console.error('User is not defined. Cannot access new food page.');
    return res.redirect('/auth/sign-in'); 
  }


  res.render('foods/new', { userId: req.user._id });
})


router.post('/', async (req, res) => {
  const userId = req.body.userId; 

  if (!userId) {
    console.error('User ID is not provided.');
    return res.status(400).send('User ID is required');
  }

  const newFood = new Food({
    name: req.body.name,
  });

  newFood.save()
  const user = await User.findById(userId);
  user.pantry.push(newFood._id); 
  await user.save(); 
  req.session.user = { _id: user._id, username: user.username };
    res.redirect(`/users/${user._id}/foods`);
  
});


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

// Route to display a specific food item
router.get('/:foodId', async (req, res) => {
  const foodId = req.params.foodId;

  try {
    const food = await Food.findById(foodId);

    if (!food) {
      console.error('Food item not found');
      return res.status(404).send('Food item not found');
    }

    res.render('foods/show.ejs', { food });
  } catch (error) {
    console.error('Error fetching food item:', error);
    res.status(500).send('Server Error');
  }
});

router.get('/:foodId/edit', async (req, res) => {
  const foodId = req.params.foodId;

  try {
    const food = await Food.findById(foodId);

    if (!food) {
      console.error('Food item not found');
      return res.status(404).send('Food item not found');
    }

    res.render('foods/edit.ejs', { food });
  } catch (error) {
    console.error('Error fetching food item:', error);
    res.status(500).send('Server Error');
  }
});

router.put('/:foodId', async (req, res) => {
  const foodId = req.params.foodId;

  try {
    const updatedFood = await Food.findByIdAndUpdate(
      foodId,
      { name: req.body.name },
      { new: true } 
    );

    if (!updatedFood) {
      console.error('Food item not found for update');
      return res.status(404).send('Food item not found');
    }

    console.log('Food item updated successfully:', updatedFood);
    res.redirect(`/users/${req.session.user._id}/foods`);
  } catch (error) {
    console.error('Error updating food item:', error);
    res.status(500).send('Server Error');
  }
});

router.delete('/:foodId', async (req, res) => {
  const userId = req.user._id;
  const foodId = req.params.foodId;

  try {
    await Food.findByIdAndDelete(foodId);

    const user = await User.findById(userId);
    user.pantry = user.pantry.filter(item => item.toString() !== foodId);
    await user.save();

    console.log('Food item deleted and removed from pantry:', foodId);
    
    res.redirect(`/users/${userId}/foods`);
  } catch (error) {
    console.error('Error deleting food item:', error);
    res.status(500).send('Server Error');
  }
});


router.get('*', (req, res) => {
  console.log('Invalid Route Accessed:', req.originalUrl);
  res.status(404).send('Not Found');
});

module.exports = router;
