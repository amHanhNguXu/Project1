const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var Comment = require('./comment');
const User = require('./user');

// post Schema
const PostSchema = new Schema({
   createdAt: {
      type: Date
   },
   updatedAt: {
      type: Date
   },
   title: {
      type: String,
      required: true
   },
   url: {
      type: String,
      required: true
   },
   summary: {
      type: String,
      required: true
   },
   subreddit: {
      type: String,
      required: true
   },
   author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true
   },
   // upVote: {
   //    type: Number,
   //    default: 0
   // },
   // downVote: {
   //    type: Number,
   //    default: 0
   // },
   // voteScore: {
   //    type: Number,
   //    default: 0
   // },
   // voteTotal: {
   //    type: Number,
   //    default: 0
   // },

    // emmbed document
   comments: [Comment.schema]

   // ref document
   // comments: [
   //    {
   //       type: Schema.Types.ObjectId,
   //       ref: 'Comment'
   //    }
   // ]


});

PostSchema.pre('save', function (next) {
   // set createdAt and updatedAt
   const now = new Date();
   this.updatedAt = now;
   if (!this.createdAt) {
      this.createdAt = now;
   }
   next();
});

module.exports = mongoose.model('Post', PostSchema);