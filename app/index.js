var app = require('express')();
var dgram = require('dgram');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = 3000

const server = dgram.createSocket('udp4');


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);

io.on('connection', function(socket) {
  
  console.log('we have a connection');

  server.on('message', (msg, rinfo) => {
    socket.emit('news', { text: msg.toString() });
  });
});

