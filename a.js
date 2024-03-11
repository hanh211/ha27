const app = require('express')(),
  server = require('http').Server(app),
  io = require('socket.io')(server),
  rtsp = require('rtsp-ffmpeg');
server.listen(process.env.PORT || 3000);
var uri = 'rtsp://admin:admin1234@192.168.1.15:554/cam/realmonitor?channel=1&subtype=0',
  stream = new rtsp.FFMpeg({input: uri});
io.on('connection', function(socket) {
  var pipeStream = function(data) {
    socket.emit('data', data.toString('base64'));
  };
  stream.on('data', pipeStream);
  socket.on('disconnect', function() {
    stream.removeListener('data', pipeStream);
  });
});
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
