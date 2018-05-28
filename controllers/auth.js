const User = require('../models/user');
const jwt = require('jsonwebtoken');
module.exports = (app) => {

   // register form
   app.get('/register', (req, res) => {
      res.render('register');
   });
   
   
   // register process
   app.post('/register', (req, res) => {
      const user = new User;
      user.username = req.body.username;
      user.password = req.body.password;
      user.save().then((user) => {
         var token = jwt.sign({ _id: user._id }, 'secretkey', {expiresIn: '60 days'});
         // res.cookie('nToken', token, { maxAge: 1000*60*60*24, httpOnly: true });
         res.redirect('/login');
      }).catch((err) => {
         console.log(err);
         return res.status(400).send({ err: err });
      });
   });

   
   // Login form
     app.get('/login', (req, res) => {
        res.render('login');
     });

     app.post('/login', (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        // Find this user name
        User.findOne({ username }, 'username password').then((user) => {
           if (!user) {
              // User not found
              return res.status(401).send({ message: 'Wrong Username'});
           }
           // Check the password
           user.comparePassword( password, (err, isMatch) => {
              if (!isMatch) {
                 // Password not match
                 console.log(password);
                 return res.status(401).send({ message: 'Wrong Password' });
              }
              // Creat a token
              console.log(user);
              const token = jwt.sign(
                 {
                    _id: user._id,
                    username: user.username
                 },
                 'secretkey',
                 {
                    expiresIn: '60 days'
                 }
              );
              // Set a cookie and redirect to root
              res.cookie('nToken', token, { maxAge: 1000*60*60*24, httpOnly: true });
              res.redirect('/');
           });
        }).catch((err) => {
           console.log(err);
        })
     })


   // Logout 
   app.get('/logout', (req, res) => {
      res.clearCookie('nToken');
      res.redirect('/');
   })
}