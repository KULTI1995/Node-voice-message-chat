var express = require('express');
var app = express();

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'
 
var server = app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", port " + server_port )
});

var io = require('socket.io')(server);
fs = require('fs');



app.get('/',function(req,res){
     res.sendFile(__dirname + '/index.html');

});

count = 0; //numbers of active users. (all)

io.on('connection', function (socket) {
    count++
    socket.emit('count', {count:count})
    socket.on('disconnect', function(){
        count--
        socket.broadcast.emit('count', {count:count});
    });
    socket.on('login', function(data, kolor){
        socket.nickname = data;
        socket.nickkolor = kolor; 
        console.log(data, "Jest połączony !");
        socket.broadcast.emit('hello', socket.nickname);
  });
    socket.on('audio', function(blob_object, time){
        console.log(time);
        socket.broadcast.emit('stream', blob_object, time, socket.nickname, socket.nickkolor);
  });
    
    socket.on('message', function(message, time){
        console.log(message, time, socket.nickkolor, socket.nickkolor);
        socket.broadcast.emit('sendmessage', message, socket.nickname, socket.nickkolor, time);
  });
});

