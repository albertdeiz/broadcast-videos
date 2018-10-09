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
const rooms = new Rooms(['room 1', 'room 2', 'room 3'])

app.use(express.static(publicPath))

io.on('connection', (socket) => {
	socket.emit('updateRoomNames', rooms.list)

	socket.on('token', ({token}, callback) => {
		try {
			users.getUserByToken(token, (err, user) => {
				if (err) {
					throw(err)
				} else {
					const room = rooms.getRoom(user.data.roomId)
					return callback(null, user.data, room)
				}
			})
		} catch (e) {
			return callback(e)
		}
	})

	socket.on('join', (user, callback) => {
		users.login(user.username, user.password, (err, data) => {
			if (err) {
				callback(err)
			} else {
				return callback(null, data.user.data, data.token)
			}
		})
	})

	socket.on('joinRoom', ({token, data}, callback) => {
		try {
			users.getUserByToken(token, (err, user) => {
				if (err) {
					throw(err)
				} else {
					const room = rooms.getRoom(data.roomId)
					if (!room) {
						throw('room doesn\'t exist')
					}
					socket.join(data.roomId)
					user.set('roomId', data.roomId)
					socket.emit('newMessage', Message.generateMessage('Admin', 'Welcome to Room'))
					socket.broadcast.to(data.roomId).emit('newMessage', Message.generateMessage('Admin', `${user.data.username} has joined.`))
					return callback(null, room)
				}
			})
		} catch (e) {
			return callback(e)
		}
	})

	socket.on('playlist:add', ({token, data}, callback) => {
		try {
			users.getUserByToken(token, (err, user) => {
				if (err) {
					throw(err)
				} else {
					const room = rooms.getRoom(user.data.roomId)
					const playlist = room.addToPlaylist(data.item)
					socket.emit('playlist:add', playlist)
					socket.broadcast.to(user.data.roomId).emit('playlist:add', playlist)	
					return callback(null, playlist)
				}
			})
		} catch (e) {
			return callback(e)
		}
	})

	socket.on('playlist:setIndex', ({token, data}, callback) => {
		try {
			users.getUserByToken(token, (err, user) => {
				if (err) {
					throw(err)
				} else {
					const room = rooms.getRoom(user.data.roomId)
					const newIndex = room.setIndexList(data.indexPlaylist)
					socket.emit('playlist:setIndex', newIndex)
					socket.broadcast.to(user.data.roomId).emit('playlist:setIndex', newIndex)	
					return callback(null, newIndex)
				}
			})
		} catch (e) {
			return callback(e)
		}
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
})

server.listen(port, () => {
	console.log(`Started on port ${port}`)
})
