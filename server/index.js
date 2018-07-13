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
	console.log('New user connected')

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
		console.log('new user', user)
		console.log('all users', users.users)
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
		users.setRoom(user.id, room.id)
		socket.emit('newMessage', Message.generateMessage('Admin', 'Welcome to the App'))
		socket.broadcast.to(room.id).emit('newMessage', Message.generateMessage('Admin', `${user.name} has joined.`))
		console.log('all users', users.users)
		return callback(null, room)
	})

	socket.on('createRoom', (roomName, callback) => {
		if (rooms.matchRoom(roomName)) {
			return callback(`Room ${roomName} already exist`)
		}
		const room = rooms.addRoom(roomName)
		socket.emit('updateRoomList', rooms.rooms)
		socket.broadcast.emit('updateRoomList', rooms.rooms)
	})

	socket.on('createMessage', (message, callback) =>  {
		const user = users.getUser(socket.id)
		if (user && isRealString(message.text)) {
			io.to(user.room).emit('newMessage', Message.generateMessage(user.name, message.text))
		}
		callback()
	})

	socket.on('createLocationMessage', (coords) => {
		const user = users.getUser(socket.id)
		if (user) {
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))	
		}
	})

	socket.on('disconnect', () => {
		const user = users.removeUser(socket.id)
		if (user) {
			io.to(user.room).emit('updateUserList', users.getUserList(user.room))
			io.to(user.room).emit('newMessage', Message.generateMessage('Admin', `${user.name} has left the chat room.`))
		}
		console.log('User Disconnected')
	})	
})

server.listen(port, () => {
	console.log(`Started on port ${port}`)
})
