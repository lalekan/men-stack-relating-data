// middleware/is-signed-in.js

const isSignedIn = (req, res, next) => {
    if (req.session.user){
      return next();
    } else {
      res.redirect('/auth/sign-in')
    }
    // res.redirect('/auth/sign-in');
};
  
  module.exports = isSignedIn;
  