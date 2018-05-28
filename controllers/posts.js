const express = require('express');
const router = express.Router();
// load models Post Schema
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

//  vote post up
router.put('/:id/vote-up', (req, res) => {
   Post.findById(req.params.id).then((post) => {
      console.log('co post',post);
      // post.upVote.push(req.user._id);
      // post.voteScore = post.voteTotal + 1;
      post.upVote += 1;
      post.save().then(post => console.log(post));

      res.status(200);
   }).catch(err => console.log('no post',err.message));
});

// vote post down
router.put('/:id/vote-down', (req, res) => {
   Post.findById(req.params.id).then((post) => {
      // post.downVote.push(req.user._id);
      // post.voteScore = post.voteTotal - 1;
      post.upVote -= 1;
      post.save();

      res.status(200);
   })
});


// get posts/new route
router.get('/new', (req, res) => {
   if (req.user !== null) {
      const currentUser = req.user;
      res.render('posts-new', {
         currentUser: currentUser
      });
   } else {
      res.redirect('/login');
   }
   // res.render('posts-new');
});

// post posts/new route
router.post('/new', (req, res) => {

   // create property in post
   let post = new Post;
   post.title = req.body.title;
   post.url = req.body.url;
   post.summary = req.body.summary;
   post.subreddit = req.body.subreddit;
   post.author = req.user._id;

   // save post to db
   post.save().then((post) => {
      console.log(post);
      return User.findById(req.user._id);
   }).then((user) => {
      console.log(user);
      
      user.posts.unshift(post);
      user.save().then((user) => {
         console.log(user);
      }).catch((err) => {
         console.log(err.message);
      })
      res.redirect('/posts/' + post._id);
   }).catch((err) => {
      console.log(err.message);
   });
});

router.get('/:id', (req, res) => {
   if (req.user) {
      const currentUser = req.user;
      const username = currentUser.username;
      Post.findById(req.params.id).populate('author', 'username').populate('comments.author', 'username').populate('comments.comments.author', 'username').then((post) => {
         let comments = post.comments;
         // console.log(comments);
         console.log(currentUser);
         res.render('post-index', {
            post,
            comments,
            currentUser,
            username
         });
      });
   } else {
      res.redirect('/login');
   }
});

module.exports = router;