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
const port = process.env.PORT || 3000

const users = new Users()
const rooms = new Rooms()

app.use(express.static(publicPath))

io.on('connection', (socket) => {
	console.log('New user connected')

	socket.on('join', (params, callback) => {
		if (!isRealString(params.name) && !isRealString(params.room)) {
			return callback('Name and Room name are required')
		}
		if (users.matchUser(params.name)) {
			return callback('Name is already taked')
		}
		socket.join(params.room)
		users.removeUser(socket.id)
		const user = users.addUser(socket.id, params.name, params.room)
		io.to(user.room).emit('updateUserList', users.getUserList(user.room))
		socket.emit('newMessage', Message.generateMessage('Admin', 'Welcome to the chat App'))
		socket.broadcast.to(user.room).emit('newMessage', Message.generateMessage('Admin', `${user.name} has joined.`))
		socket.emit('updateRoomList', rooms.getRoomListName())
		callback()
	})

	socket.on('createRoom', (roomName, callback) => {
		if (rooms.matchRoom(roomName)) {
			return callback(`Room ${roomName} already exist`)
		}
		const room = rooms.addRoom(roomName)
		socket.broadcast.emit('updateRoomList', rooms.getRoomListName(), room)
	})

	socket.on('createMessage', (message, callback) =>  {
		const user = users.getUser(socket.id)
		if (user && isRealString(message.text)) {
			io.to(user.room).emit('newMessage', Message.generateMessage(user.name, message.text))
		}
		console.log('New Message', message)
		callback()
	})

	socket.on('createLocationMessage', (coords) => {
		const user = users.getUser(socket.id)
		console.log(user)
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
