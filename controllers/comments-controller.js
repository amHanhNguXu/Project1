const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

module.exports = (app) => {
   // create comment
   app.post('/posts/:postId/comments', (req, res) => {
      let id = req.params.postId;
      // instantiate instance
      const comment = new Comment;
      comment.content = req.body.content;
      // console.log(req.user);
      comment.author = req.user._id;

      // save instance to db
      comment.save().then((comment) => {
         console.log(comment);
         return Post.findById(req.params.postId);
      }).then((post) => {
         console.log(post);
         post.comments.unshift(comment);
         post.save();
         return User.findById(req.user._id);
      }).then((user) => {
         user.comments.unshift(comment);
         user.save();
      }).then((user) => {
         res.redirect('/posts/' + id);
      }).catch((err) => {
         console.log(err);
      });
   });

   

   // Reply comments
   app.get('/posts/:postId/comments/:commentId/replies/new', (req, res) => {
      let post;
      Post.findById(req.params.postId).then((p) => {
         post = p;
         return Comment.findById(req.params.commentId);
      }).then((comment) => {
         res.render('replies-new', {
            post,
            comment
         });
      }).catch((err) => {
         console.log(err.message);
      });
   })

   // Create reply
   app.post('/posts/:postId/comments/:commentId/replies', (req, res) => {
      
      Comment.findById(req.params.commentId).then((comment) => {
         // console.log(req.body);
         // console.log(comment.comments);
         const data = {
            content: req.body.content,
            author: req.user
         };
         comment.comments.unshift(data);
         comment.save().then((comment) => {
      
            Post.findById(req.params.postId).then((post) => {
               
               const postComment = post.comments.id(req.params.commentId);
               
               postComment.comments.unshift(data);

               post.save();

                res.redirect('/posts/' + req.params.postId);

            }).catch((err) => {
               console.log(err.message);
            })
         }).catch((err) => {
            console.log(err.message);
         })
      })

   });
}