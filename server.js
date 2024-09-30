const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const methodOverride = require('method-override');

const app = express();
const mongoose = require('mongoose');
const session = require('express-session');

const passUserToView = require('./middleware/pass-user-to-view.js');
const authController = require('./controllers/auth.js');
const isSignedIn = require('./middleware/is-signed-in.js');
const foodsController = require('./controllers/foods.js');

const port = process.env.PORT || '3000';

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connection successful'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView); // Session must be initialized before this middleware

// Route definitions
app.use('/auth', authController);  // Use auth routes

// Protect these routes with `isSignedIn`
app.use('/users/:userId/foods', isSignedIn, foodsController);

// Home route
app.get('/', (req, res) => {
  res.render('foods/index.ejs', {
    user: req.session.user,
  });
});

// VIP Lounge route
app.get('/vip-lounge', (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send('Sorry, no guests allowed.');
  }
});






// MongoDB connection event
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Start server
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
