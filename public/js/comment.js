// connect 
var socket = io();



// DOM event
const message = document.getElementById('message');
const btn = document.getElementById('send');
const author = currentUser.value;
const pId = postId.value;
const username = nameAuthor.value;

const comment = document.getElementById('comment');
const commentId = document.getElementById('commentId');
console.log('commentId', commentId.value);
console.log(pId);
console.log(author)
console.log(username);

btn.addEventListener('click', function() {
   socket.emit('comment', {
      content: message.value,
      author: author,
      postId: pId,
      commentId: commentId.value,
      username: username
   });
   message.value = "";
});

socket.on('comment', function (data) {
   comment.innerHTML += '<p>' + data.username + ' : ' + data.content + '</p>';
});


// reply comment
const reply = document.getElementsByClassName('reply');
const textbox = document.getElementsByClassName('textbox');
const subcomment = document.getElementsByClassName('subcomment');
const submit = document.getElementsByClassName('submit');

// add event when click reply
for (var i=0; i < reply.length; i++) {
   reply[i].addEventListener('click', function(e) {
      e.target.parentNode.querySelector('.textbox').style.display = 'initial';
   });
}

for (var i=0; i < submit.length; i++) {
   submit[i].addEventListener('click', function(e) {

      socket.emit('subcomment', {
         
      });
   })
}