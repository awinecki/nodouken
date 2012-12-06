$(function() {

  $('#join-btn').click(function() {
    var name = $('#name-input').val();
    $('#join-form').fadeOut();
    ioConnect(name);
  });

  function ioConnect(name) {
    var socket = io.connect('http://localhost');

    cached = {};

    socket.on('connect', function() {
      socket.emit('name', name);
    });

    function makeCursor(hash, name) {
      var e = document.createElement('div');
      e.id = hash;
      e.className = 'label label-info cursor';
      $(e).html(name);
      $('#cursors-container').append($(e));
      cached[hash] = $(e);
    }

    socket.on('clients', function(data) {
      $.each(data, function(key, val) {
        makeCursor(key, val.name);
      });
    });

    socket.on('state', function(data) {
      $.each(data, function(key, val) {
        cached[key].css({ top: val.coords.y - 10, left: val.coords.x - 10});
      });
    });

    socket.on('removeClient', function(data) {
      cached[data.id].remove();
      delete cached[data.id];
    });

    socket.on('newClient', function(data) {
      makeCursor(data.id, data.name);
    });

    $(document).mousemove(function(e) {
      socket.emit('coords', { x: e.pageX, y: e.pageY });
    });
  }

});
