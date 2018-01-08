var app = require('http').createServer(handler)
  , io = require('socket.io')(app)
  , fs = require('fs')

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", port " + server_port )
});

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200, {'Content-Type': 'text/html' });
    res.end(data);


  });
}

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

