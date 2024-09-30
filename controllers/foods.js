// controllers/foods.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// router logic will go here - will be built later on in the lab

router.get('/', (req, res) => {
    res.render('foods/index.ejs')
}); 

router.get('/users/:userId/foods/new', (req, res) => {
    res.render('foods/new.ejs')
})

router.get("/users/:userId/foods/", async (req, res) => {
    const allFood = await User.find();
    console.log(allFood); // log the fruits!
    res.render('foods/index.ejs', {food: allFood});
});


  
  

module.exports = router;
