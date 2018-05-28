const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const UserSchema = new Schema({
   createdAt: {
      type: Date
   },
   updatedAt: {
      type: Date
   },
   username: {
      type: String,
      required: true
   },
   password: {
      type: String,
      select: false
   },
   posts: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Post'
      }
   ],
   comments: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Comment'
      }
   ]
});
UserSchema.pre('save', function (next) {
   // console.log(this);
   // set createdAt AND updatedAt
   const now = new Date();
   this.updatedAt = now;
   if (!this.createdAt) {
      this.createdAt = now;
   }

   // Encrypts password
   const user = this;
   // console.log(user);
   if (!user.isModified('password')) {
      return next();
   }
   bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
         user.password = hash;
         next();
      })
   });
});


UserSchema.methods.comparePassword = function( password, done){
   bcrypt.compare(password, this.password, (err, isMatch) => {
      done(err, isMatch);
   });
};

module.exports = mongoose.model('User', UserSchema);