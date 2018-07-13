class Users {
	constructor() {
		this.users = []
	}

	addUser(id, name) {
		const user = {
			id,
			name,
			room: null
		}
		this.users.push(user)
		return user
	}

	matchUser(name) {
		return this.users.filter((user) => user.name === name)[0]
	}

	removeUser(id) {
		const user = this.getUser(id)
		if (user) {
			this.users = this.users.filter((user) => user.id !== id)
		}
		return user
	}

	getUser (id) {
		return this.users.filter((user) => user.id === id)[0]
	}

	setRoom(id, roomId) {
		let userData
		this.users.map((user) => {
			if (user.id === id) {
				user.roomId = roomId
			}
			return user
		})
	}

	getUserList (room) {
		const users = this.users.filter((user) => {
			return user.room === room
		})
		const namesArray = users.map((user) => {
			return user.name
		})
		return namesArray
	}
}

export default Users
