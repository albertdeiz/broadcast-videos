import Room from './room'

class Rooms {
	constructor(initialStoge) {
		this.list = []
		this.currentId = 1
		if (typeof initialStoge === 'object') {
			initialStoge.forEach(room => {
				try {
					const newRoom = new Room(this.currentId, room)
					this.addRoom(newRoom)
				} catch (e) {
					new Error('error creating room:', e)
				}
			})
		}
	}

	createRoom(name) {
		const room = new Room(this.currentId, name)
		this.addRoom(room)
		return room
	}

	addRoom(room) {
		this.list.push(room)
		this.currentId++
		return room
	}

	removeRoom(id) {
		const room = this.getUser(id)
		if (room) {
			this.list = this.list.filter((room) => room.id !== id)
		}
		return room
	}

	getRoom(id) {
		return this.list.filter((room) => room.id === id)[0]
	}
}

export default Rooms
