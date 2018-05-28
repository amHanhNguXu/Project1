const express = require('express');
const router = express.Router();
// load models Post Schema
const Post = require('../models/post');

// category Post
router.get('/:subreddit', (req, res) => {
   let query = {subreddit: req.params.subreddit};
   // console.log(query);
   Post.find(query).then((posts) => {
      console.log(posts);
      res.render('index', {
         posts: posts
      })
   }).catch((err) => {
      console.log(err);
   })
});

module.exports = router;