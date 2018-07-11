// Setup basic express server
var express = require('express')
var app = express()
var path = require('path')
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var port = process.env.PORT || 4113

server.listen(port, () => {
  console.log('Server listening at port %d', port)
})

// Routing
app.use(express.static(path.join(__dirname, '..', 'public')))

// usernames which are currently connected to the chat
var usernames = {}

// rooms which are currently available in chat
var rooms = ['room1','room2','room3']

io.sockets.on('connection', function (socket) {

  socket.on('user:new', function(username) {
    socket.username = username
    socket.room = 'room1'
    usernames[username] = username
    socket.join('room1')
    socket.emit('chat:update', 'SERVER', 'you have connected to room1')
    socket.broadcast.to('room1').emit('chat:update', 'SERVER', username + ' has connected to this room')
    socket.emit('user:success', username)
    socket.emit('room:update', rooms, 'room1')
  })

  socket.on('chat:send', function (data) {
    io.sockets.in(socket.room).emit('chat:update', socket.username, data)
  })

  socket.on('room:switch', function(newroom){
    socket.leave(socket.room)
    socket.join(newroom)
    socket.emit('chat:update', 'SERVER', 'you have connected to '+ newroom)
    socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room')
    socket.room = newroom
    socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room')
    socket.emit('room:list', rooms, newroom)
  })

  socket.on('disconnect', function(){
    delete usernames[socket.username]
    io.sockets.emit('updateusers', usernames)
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected')
    socket.leave(socket.room)
  })
})
