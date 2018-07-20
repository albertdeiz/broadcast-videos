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

const users = new Users([{id: 1, username: 'aado29', password: '21367773'}])
const rooms = new Rooms([{id: 9328, name: 'room 1'}, {id: 9322, name: 'room 2'}])

app.use(express.static(publicPath))

io.on('connection', (socket) => {
	socket.emit('updateRoomNames', rooms.rooms)

	socket.on('join', (user, callback) => {
		users.login(user.username, user.password, (err, user) => {
			if (err) {
				callback(err)
			} else {
				user.setSocket(socket.id)
				return callback(null, user.data)
			}
		})
	})

	socket.on('joinRoom', (roomId, callback) => {
		users.getUserBySocket(socket.id, (err, user) => {
			if (!err) {
				return callback(err)
			} else {
				socket.join(roomId)
				user.set('roomId', roomId)
				socket.emit('newMessage', Message.generateMessage('Admin', 'Welcome to Room'))
				socket.broadcast.to(roomId).emit('newMessage', Message.generateMessage('Admin', `${user.data.username} has joined.`))
				return callback(null, rooms.getRoom(roomId))
			}
		})
	})

	// socket.on('createRoom', (roomName, callback) => {
	// 	const user = users.getUser(socket.id)
	// 	if (!user) {
	// 		return callback('You have to be logged')
	// 	}
	// 	if (rooms.matchRoom(roomName)) {
	// 		return callback(`Room ${roomName} already exist`)
	// 	}
	// 	const newRoom = rooms.addRoom(roomName)
	// 	socket.broadcast.emit('updateRoomList', rooms.rooms)
	// 	return callback(null, newRoom)
	// })

	// socket.on('createMessage', (message, callback) =>  {
	// 	const user = users.getUser(socket.id)
	// 	if (!user) {
	// 		return callback('You have to be logged')
	// 	}
	// 	if (!isRealString(message)) {
	// 		return callback('message format does\'nt correct')
	// 	}
	// 	const newMessage = Message.generateMessage(user.name, message)
	// 	socket.broadcast.to(user.room.id).emit('newMessage', newMessage)
	// 	return callback(null, newMessage)
	// })

	// socket.on('createLocationMessage', (coords) => {
	// 	const user = users.getUser(socket.id)
	// 	if (user) {
	// 		socket.broadcast.to(user.room.id).emit('newLocationMessage', Message.generateLocationMessage(user.name, coords.latitude, coords.longitude))	
	// 	}
	// })

	// socket.on('createVideoMessage', (video) => {
	// 	const user = users.getUser(socket.id)
	// 	if (user) {
	// 		socket.broadcast.to(user.room.id).emit('newVideoMessage', Message.generateVideoMessage(user.name, video))	
	// 	}
	// })

	socket.on('disconnect', () => {
		users.getUserBySocket(socket.id, (err, user) => {
			if (!err) {
				const removeSocket = user.removeSocket(socket.id)
				if (removeSocket) {
					const roomId = user.roomId
					if (roomId) {
						const room = rooms.getRoom(roomId)
						socket.broadcast.to(room.id).emit('newMessage', Message.generateMessage('Admin', `${user.username} was disconnected.`))
					}
					console.log(user.data.username + ' Socket disconnected')
				}
			}
		})
	})	
})

server.listen(port, () => {
	console.log(`Started on port ${port}`)
})
