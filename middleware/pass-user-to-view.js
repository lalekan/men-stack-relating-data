const mongoose = require('mongoose');

const passUserToView = (req, res, next) => {
  if (req.session && req.session.user) {

    console.log('User ID:', req.session.user._id);
    
    const isValidUser = mongoose.Types.ObjectId.isValid(req.session.user._id);
    
    res.locals.user = isValidUser ? req.session.user : null;  
    res.locals.isValidUser = isValidUser; 
  } else {
    res.locals.user = null; 
    res.locals.isValidUser = false;  
  }
  next();
}

module.exports = passUserToView;
