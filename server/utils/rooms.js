class Rooms {
	constructor(initialStoge) {
		this.rooms = typeof initialStoge === 'object' ? [...initialStoge]: []
		this.currentId = 1
	}

	addRoom(name) {
		const room = {
			id: this.currentId,
			name
		}
		this.rooms.push(room)
		this.currentId++
		return room
	}

	matchRoom(name) {
		return this.rooms.filter((room) => room.name === name)[0]
	}

	removeRoom(id) {
		const room = this.getUser(id)
		if (room) {
			this.rooms = this.rooms.filter((room) => room.id !== id)
		}
		return room
	}

	getRoom(id) {
		return this.rooms.filter((room) => room.id === id)[0]
	}

	getRoomListName() {
		const namesArray = this.rooms.map((room) => {
			return room.name
		})
		console.log('rooms', namesArray)
		return namesArray
	}
}

export default Rooms
