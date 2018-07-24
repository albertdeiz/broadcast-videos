import User from './user'
import jwt from 'jwt-simple'
const secret = 'secretphrase'

class Users {
	constructor(initialStoge) {
		this.users = []
		if (typeof initialStoge === 'object') {
			initialStoge.forEach(user => {
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
			return callback(null, {
				user: userData,
				token: jwt.encode(userData.data, secret)
			})
		} else {
			try {
				const newUser = new User({
					id: this.currentId,
					username,
					password
				})
				this.addUser(newUser)
				return callback(null, {
					user: newUser,
					token: jwt.encode(newUser.data, secret)
				})
			} catch (e) {
				return callback(e)
			}
		}
	}

	addUser(user) {
		this.users.push(user)
		this.currentId++
	}

	getUserById(id, callback) {
		this.users.forEach(user => {
			if (user.data.id === id) {
				return callback(null, user)
			}
		})
		return callback('user not found')
	}

	getUserByToken(token, callback) {
		try {
			const payload = jwt.decode(token, secret)
			this.getUserById(payload.id, (err, user) => {
				if (err) {
					throw(err)
				} else {
					return callback(null, user)
				}
			})
		} catch (e) {
			return callback(e)
		}
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
