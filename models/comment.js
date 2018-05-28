const mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

// comment model
var CommentSchema = new Schema();
CommentSchema.add({
   content: {
      type: String,
      required: true
   },
   author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   comments: [CommentSchema]
});


module.exports = mongoose.model('Comment', CommentSchema);