'use strict';

var socketIO = require('socket.io');


module.exports = function(server) {

  var io = socketIO(server);
  io.on('connection', function(socket) {
    
    socket.on('chatMessage', function(data) {
      io.emit('chatMessage',data);
      io.to(socket.room).emit('chatMessage', data);
    });

    socket.on('disconnect', function() {
      socket.leave(socket.room);
    });
  })
}
