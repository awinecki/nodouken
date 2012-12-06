
var io = require("socket.io");

var clients = {};

// counter to let server omit some events.
var counter = 0;

function init(ws) {
	ws.sockets.on('connection', function (socket) {

    //create new client obj
    clients[socket.id] = {
      coords: { x: 0, y: 0 },
      name: ''
    };

    socket.on('name', function(name) {
      clients[socket.id].name = name;
      socket.emit('clients', clients);

      socket.broadcast.emit('newClient', { 
        id: socket.id,
        name: name 
      });
    });

		socket.on('disconnect', function() {
			console.log(socket.id);
      delete clients[socket.id];
      ws.sockets.emit('removeClient', { id: socket.id });
		});

		socket.on('coords', function(data) {
      counter++;
      if (counter === 2) {
        clients[socket.id].coords = data;
        ws.sockets.emit('state', clients);
        counter = 0;
      }
		});

	});
}

exports.init = init;

