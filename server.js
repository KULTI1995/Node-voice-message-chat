var express = require('express');
var app = express();

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
var server = app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", port " + server_port )
});

var io = require('socket.io')(server);
fs = require('fs');



app.get('/chat',function(req,res){
       
     res.sendFile(__dirname + '/index.html');

});

io.on('connection', function (socket) {
  socket.on('login', function(data){
    socket.nickname = data;
    console.log(data, "Jest połączony !");
    socket.broadcast.emit('hello', socket.nickname);
  });
  socket.on('audio', function(blob_object, time){
    console.log(time);
    socket.emit('stream', blob_object);
  });
});

