var io = require('socket.io').listen(7778);
var http = require('http');


var newMessage = function(message, author){
  return {
      author: author,
      message: message,
      date: new Date()
  };
};

var chatMessages = [];

chatMessages.push(newMessage("you are h4wt", "rgimmy"));
chatMessages.push(newMessage("like totally", "rgimmy"));

var drawMessages = [];

io.sockets.on('connection', function (socket) {
  socket.emit('init', { chats: { messages: chatMessages }, drawData: { messages: drawMessages }});
  socket.on('chat', function (data) {
    var msg = newMessage(data.chat, data.author);
    chatMessages.push(msg);
    socket.emit('new chat', msg);
  });
});


// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello World\n");
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(7777);