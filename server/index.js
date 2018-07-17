import express from 'express'
import path from 'path'
import http from 'http'
import socketIO from 'socket.io'

import Users from './utils/users'
import Rooms from './utils/rooms'
import Message from './utils/message'
import { isRealString } from './utils/validation'

const app = express()
const publicPath = path.join(__dirname, '../public')
const server = http.createServer(app)
const io = socketIO(server)
const port = process.env.PORT || 4113

const users = new Users()
const rooms = new Rooms([{id: 9328, name: 'room 1'}, {id: 9322, name: 'room 2'}])

app.use(express.static(publicPath))

io.on('connection', (socket) => {
	socket.emit('updateRoomNames', rooms.rooms)

	socket.on('join', (userName, callback) => {
		if (!isRealString(userName)) {
			return callback('Name is required')
		}
		if (users.matchUser(userName)) {
			return callback('Name is already taked')
		}
		users.removeUser(socket.id)
		const user = users.addUser(socket.id, userName)
		return callback(null, user)
	})

	socket.on('joinRoom', (roomId, callback) => {
		const room = rooms.getRoom(roomId)
		const user = users.getUser(socket.id)
		if (!user) {
			return callback('You have to be logged')
		}
		if (!room) {
			return callback('Room name does\'nt exist')
		}
		socket.join(roomId)
		users.setRoom(user.id, room)
		socket.emit('newMessage', Message.generateMessage('Admin', 'Welcome to Room #' + room.name))
		socket.broadcast.to(room.id).emit('newMessage', Message.generateMessage('Admin', `${user.name} has joined.`))
		return callback(null, room)
	})

	socket.on('createRoom', (roomName, callback) => {
		const user = users.getUser(socket.id)
		if (!user) {
			return callback('You have to be logged')
		}
		if (rooms.matchRoom(roomName)) {
			return callback(`Room ${roomName} already exist`)
		}
		const newRoom = rooms.addRoom(roomName)
		socket.broadcast.emit('updateRoomList', rooms.rooms)
		return callback(null, newRoom)
	})

	socket.on('createMessage', (message, callback) =>  {
		const user = users.getUser(socket.id)
		if (!user) {
			return callback('You have to be logged')
		}
		if (!isRealString(message)) {
			return callback('message format does\'nt correct')
		}
		const newMessage = Message.generateMessage(user.name, message)
		socket.broadcast.to(user.room.id).emit('newMessage', newMessage)
		return callback(null, newMessage)
	})

	socket.on('createLocationMessage', (coords) => {
		const user = users.getUser(socket.id)
		if (user) {
			socket.broadcast.to(user.room.id).emit('newLocationMessage', Message.generateLocationMessage(user.name, coords.latitude, coords.longitude))	
		}
	})

	socket.on('createVideoMessage', (video) => {
		const user = users.getUser(socket.id)
		if (user) {
			socket.broadcast.to(user.room.id).emit('newVideoMessage', Message.generateVideoMessage(user.name, video))	
		}
	})

	socket.on('disconnect', () => {
		const user = users.removeUser(socket.id)
		if (user && user.room) {
			socket.broadcast.to(user.room.id).emit('newMessage', Message.generateMessage('Admin', `${user.name} was disconnected.`))
			console.log(user.name + ' Disconnected')
		}
	})	
})

server.listen(port, () => {
	console.log(`Started on port ${port}`)
})
