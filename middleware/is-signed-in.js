const isSignedIn = (req, res, next) => {
  console.log('Checking if user is signed in');
  if (req.session.user) {
    console.log('User is signed in:', req.session.user);
    req.user = req.session.user; 
    return next(); 
  } else {
    console.log('User is not signed in, redirecting to sign-in');
    return res.redirect('/auth/sign-in'); 
  }
};

module.exports = isSignedIn;
