const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan');
const handlebars = require('handlebars');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
mongoose.Promise = global.Promise;

// load models Post Schema
const Post = require('./models/post');
const Comment = require('./models/comment');
const User = require('./models/user');


// connect to mongodb
mongoose.connect('mongodb://localhost/clone_rediit', (err) => {
   if (err) {
      console.log(err);
   } else {
      console.log('connected to db');
   }
});

var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(3000, function () {
   console.log('listening for requests on port 3000,');
});

// load comment with socket.io
var io = socket(server);
io.on('connection', function (socket) {
   socket.on('comment', (data) => {

      console.log('made socket connection', socket.id);
      
      const comment = new Comment({
         content: data.content,
         author: data.author
      });
      // save to db
      comment.save().then((comment) => {
         return Post.findById(data.postId);
      }).then((post) => {
         console.log(comment);
         // console.log(post);
         post.comments.unshift(comment);
         post.save();
         return User.findById(data.author);
      }).then((user) => {
         user.comments.unshift(comment);
         user.save();
      }).catch((err) => {
         console.log(err);
      });
      io.sockets.emit('comment', data);
   });
});





// setup views engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// setup static folder
app.use(express.static(path.join(__dirname,'public')));

// bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( {extended: false}));

// cookieParser middleware
app.use(cookieParser());

// morgan middleware
app.use(logger('dev'));


// check authorization
var checkAuth = (req, res, next) => {
   console.log('Checking authentication');
   if (typeof req.cookies.nToken === 'undefined' || req.cookies.nToken === null) {
      console.log(' user null');
      req.user = null;
   } else {
      var token = req.cookies.nToken;
      var decodedToken = jwt.decode(token, { complete: true }) || {};
      // console.log(decodedToken);
      req.user = decodedToken.payload;
      console.log('req.user: ', req.user);
   }

   next();
}
app.use(checkAuth);

// handle views engine
handlebars.registerHelper('if_postId', function (block) {
   if (postId)
      return block.fn(this);
   else
      return block.inverse(this);
});


// Router
// get '/' router
app.get('/', (req, res) => {
   // current user for checkAuth
   const currentUser = req.user;

   Post.find({}).then((posts) => {
      res.render('index', {
         posts,
         currentUser
      });
   }).catch((err) => {
      console.log(err);
   });
});


// router controllers
// - post router
const postRouter = require('./controllers/posts');
app.use('/posts', postRouter);
// - node reddit router
const nRouter = require('./controllers/n');
app.use('/n', nRouter);
// - comment route
// require('./controllers/comments-controller')(app);
// login route
require('./controllers/auth')(app);


