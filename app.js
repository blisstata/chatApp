$(document).ready(function(){
	var person = prompt("Please enter your name", "");

	if (person == null || person == "") {
	    txt = "User cancelled the prompt.";
	} else {
		var socket = io();
		socket.emit('username',person);
	}
	$('form').submit(function(){
      socket.emit('chat message', $('#m').val());
      $('#m').val('');
      return false;
	});
	if(socket){
		socket.on('chat message', function(mesg){
      		$('#messages').append($('<li>').html("<i>"+mesg.name + "</i> : "+ mesg.msg));
    	});
	    socket.on('username', function(users){
	    	$('#users').html('');
	    	for(var i=0;i<users.length;i++){
	    		$('#users').append($('<li><i>').text(users[i].name));
	    	}
	    });

	    socket.on('user disconnected', function(users){
	    	$('#users').html('');
	    	for(var i=0;i<users.length;i++){
	    		$('#users').append($('<li><i>').text(users[i].name));
	    	}
	    });
	}
	
});



