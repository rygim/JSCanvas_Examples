var io = require('socket.io').listen(7777);

var newMessage = function(message, author){
  return {
      author: author,
      message: message,
      date: new Date()
  };
};

var messages = [];

messages.push(newMessage("you are h4wt", "rgimmy"));
messages.push(newMessage("like totally", "rgimmy"));

io.sockets.on('connection', function (socket) {
  socket.emit('init', { messages: messages });
  socket.on('chat', function (data) {
    var msg = newMessage(data.chat, data.author);
    messages.push(msg);
    socket.emit('new chat', msg);
  });
});