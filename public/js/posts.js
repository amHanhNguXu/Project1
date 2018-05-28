
$(document).ready(function() {

   $('.vote-up').submit(function (e) {
      e.preventDefault();
      var postId = $(this).data('id');
      $.ajax({
         type: 'PUT',
         url: '/posts/' + postId + '/vote-up',
         success: function(data) {
            console.log('vote up!');
         },
         error: function(err) {
            console.log(err.message);
         }
      });
   });

   $('.vote-down').submit(function (e) {
      e.preventDefault();

      var postId = $(this).data('id');
      $.ajax({
         type: 'PUT',
         url: '/posts/' + postId + '/vote-down',
         success: function (data) {
            console.log('vote down!');
         },
         error: function (err) {
            console.log(err.message);
         }
      })
   })
});

