var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var io= require('socket.io')(http);

app.use(express.static(path.join(__dirname)));
app.get('/',function(req,res){
	res.sendFile(path.join(__dirname, 'home.html'))
});

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/chatDb";

io.on('connection', function(socket){
  socket.on('username',function(name){
  	console.log(name +' is connected');
  	var obj = {"name":name,"id":socket.id};
  	var users = [];
  	MongoClient.connect(url, function(err, db) {
  		if (err) throw err;
  		console.log("Database created!");
	  	db.collection("chatUsers").insertOne(obj,function(err, res) {
		    if (err) throw err;
		    console.log("A user inserted");
		    db.collection('chatUsers').find().toArray(function(err,res){
		    	users = res;
		    	io.emit('username',users);
		    });
		    db.close();
	  	});
	});

  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    var obj = {"id":socket.id};
    MongoClient.connect(url, function(err, db) {
	  	db.collection("chatUsers").find(obj).toArray(function(err, res) {
		    if (err) throw err;
		    var mesg = {"name":res[0].name,"msg":msg};
		    console.log(mesg);
		    io.emit('chat message',mesg);
		    db.close();
	  	});
  	});
  });

  socket.on('disconnect', function () {
  	MongoClient.connect(url, function(err, db) {
  		if (err) throw err;
  		console.log("Database created!");
  		var obj = {"id":socket.id};
	  	db.collection("chatUsers").remove(obj,function(err, res) {
		    if (err) throw err;
		    console.log("A user deleted");
		    db.collection('chatUsers').find().toArray(function(err,res){
		    	users = res;
		    	io.emit('user disconnected',users);
		    });
		    db.close();
	  	});
	});
  });
});
http.listen(3000,function(){
	console.log('listening on 3000');
});