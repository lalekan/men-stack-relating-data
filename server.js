const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path'); // Add this line

const passUserToView = require('./middleware/pass-user-to-view.js');
const authController = require('./controllers/auth.js');
const isSignedIn = require('./middleware/is-signed-in.js');
const foodsController = require('./controllers/foods.js');

const app = express();
const port = process.env.PORT || '3000';

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Set EJS as the view engine
app.set('view engine', 'ejs'); 

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView); 

// Route definitions
app.use('/auth', authController); 

// Protect food routes with middleware
app.use('/users/:userId/foods', isSignedIn, foodsController); 

// Home route must be before the catch-all route
app.get('/', (req, res) => {
  console.log('Home route accessed');
  res.render('index.ejs', {
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

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connection successful');
    // Start server only after MongoDB connection is established
    app.listen(port, () => {
      console.log(`The express app is ready on port ${port}!`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
