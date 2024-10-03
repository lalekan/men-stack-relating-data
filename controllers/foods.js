// controllers/foods.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Food = require('../models/food.js');

// router logic will go here - will be built later on in the lab

router.get('/', async (req, res) => {
    const userId = req.params.userId; // Get user ID from request parameters
  
    try {
      // Fetch food items from the database for the given user
      const foods = await Food.find({ userId: userId }); 
  
      // Render the view and pass the foods data
      res.render('foods/index.ejs', { food: foods }); // Pass the foods as 'food'
    } catch (error) {
      console.error('Error fetching foods:', error); // Log the error
      res.status(500).send('Server Error'); // Send a 500 error response
    }
  });

router.get('/users/:userId/foods/new', (req, res) => {
    res.render('foods/new.ejs')
})

router.get('/users/:userId/foods', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Log the pantry data
      console.log(user.pantry, 'Pantry data being passed to EJS');
      
      // Pass the user's pantry items (foods) to the view as 'food'
      res.render('foods/index.ejs', { food: user.pantry });
    } catch (error) {
      console.error('Error Fetching User Foods:', error);
      res.status(500).send('Server Error');
    }
  });

  // Route to get food items for a specific user
  router.get('/:userId', async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      console.log('Fetched user:', user);
      console.log('User pantry:', user.pantry);

      if (!user) {
        return res.status(404).send('User not found');
      }
  
      // Pass the user's pantry to the view
      res.render('foods/index.ejs', { food: user.pantry || [] }); // Ensure food is defined
    } catch (error) {
      console.error('Error fetching food:', error);
      res.status(500).send('Server Error');
    }
  });
  

  router.post('/', async (req, res) => {
    try {
        const foodItem = new Food({
            name: req.body.name,
            calories: req.body.calories,
            expirationDate: req.body.expirationDate,
            userId: req.params.userId 
        });

        await foodItem.save();
        res.status(201).json({ message: 'Food item added successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;
