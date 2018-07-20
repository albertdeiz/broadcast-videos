import User from './user'

class Users {
	constructor(defaultsUser) {
		this.users = []
		if (typeof defaultsUser === 'object') {
			defaultsUser.forEach(user => {
				try {
					const newUser = new User(user)
					this.addUser(newUser)
				} catch (e) {
					new Error('error creating user:', e)
				}
			})
		}
		this.currentId = this.users.length + 1
	}

	login(username, password, callback) {
		let userData = null
		this.users.forEach(user => {
			if (user.data.username === username && user.data.password === password) {
				userData = user
			}
		})
		if (userData !== null) {
			return callback(null, userData)
		} else {
			try {
				const newUser = new User({
					id: this.currentId,
					username,
					password
				})
				this.addUser(newUser)
				return callback(null, newUser)
			} catch (e) {
				return callback(e)
			}
		}
	}

	addUser(user) {
		this.users.push(user)
		this.currentId++
	}

	getUserBySocket(socketId, callback) {
		this.users.forEach(user => {
			user.sockets.forEach(socket => {
				if (socket === socketId) {
					return callback(null, user)
				}
			})
		})
		return callback('user not found')
	}

	// matchUser(name) {
	// 	return this.users.filter((user) => user.name === name)[0]
	// }

	// removeUser(id) {
	// 	const user = this.getUser(id)
	// 	if (user) {
	// 		this.users = this.users.filter((user) => user.id !== id)
	// 	}
	// 	return user
	// }

	// getUser (id) {
	// 	return this.users.filter((user) => user.id === id)[0]
	// }

	// setRoom(id, room) {
	// 	let userData
	// 	this.users.map((user) => {
	// 		if (user.id === id) {
	// 			user.room = room
	// 		}
	// 		return user
	// 	})
	// }

	// getUserList (room) {
	// 	const users = this.users.filter((user) => {
	// 		return user.room === room
	// 	})
	// 	const namesArray = users.map((user) => {
	// 		return user.name
	// 	})
	// 	return namesArray
	// }
}

export default Users
