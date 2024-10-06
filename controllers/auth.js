const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/user.js');

router.get('/sign-up', (req, res) => {
  res.render('auth/sign-up.ejs');
});

router.get('/sign-in', (req, res) => {
  res.render('auth/sign-in.ejs', { errorMessage: null }); 
});

router.get('/sign-out', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/sign-up', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (userInDatabase) {
      return res.render('auth/sign-up.ejs', { errorMessage: 'Username already taken.' });
    }
  
    if (req.body.password !== req.body.confirmPassword) {
      return res.render('auth/sign-up.ejs', { errorMessage: 'Password and Confirm Password must match.' });
    }
  
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
  
    await User.create(req.body);
    res.redirect('/auth/sign-in');
  } catch (error) {
    console.log(error);
    res.render('auth/sign-up.ejs', { errorMessage: 'An error occurred. Please try again.' });
  }
});

router.post('/sign-in', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('auth/sign-in', { errorMessage: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('auth/sign-in', { errorMessage: 'Invalid password' });
    }
    
    // Set user in session
    req.session.user = { _id: user._id, username: user.username };
    res.redirect(`/users/${user._id}/foods`);
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).send('Server error');
  }
})

module.exports = router;
