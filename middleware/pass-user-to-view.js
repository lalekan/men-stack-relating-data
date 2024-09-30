// middleware/pass-user-to-view.js

const passUserToView = (req, res, next) => {

  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;  // Set to null if req.user is undefined
  }
  next();
    // res.locals.user = req.session.user ? req.session.user : null
    // next()
}
  
  module.exports = passUserToView
  