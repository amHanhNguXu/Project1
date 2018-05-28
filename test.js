const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const Post = require('./models/post');

mongoose.connect('mongodb://localhost/deepPopulate', (err) => {
   if (err) {
      console.log(err.message);
   } else {
      console.log('connected');
   }
});

const post = new Post({
   title: 'test',
   summary: 'this test',
   url: 'google.com',
   comments: [
      {
         content: 'hello'
      }, 
      {
         content: 'sida'
      }
   ]
})
post.save().then((post) => {
   console.log(post);
})
