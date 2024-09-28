// controllers/foods.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

// router logic will go here - will be built later on in the lab

router.get('/', (req, res) => {
    res.render('foods/index.ejs')
});  

module.exports = router;
