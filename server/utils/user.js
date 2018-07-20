import { isRealString } from './validation'

class User {
  constructor(user = {}) {
    this.data = {}
    this.sockets = []
    if (!user.id) {
      throw ('User id have to exist in the constructor')
    } else if (!user.username, !isRealString(user.username)) {
      throw ('User username have to exist in the constructor')
    } else if (!user.password) {
      throw ('User password have to exist in the constructor')
    } else {
      this.data = {
        id: user.id,
        username: user.username,
        name: user.name || 'Default name',
        rooId: user.rooId || null,
        password: user.password
      }
    }
  }

  set(key, value) {
    this.data[key] = value
    return this
  }

  setSocket(socketId) {
    let { sockets } = this
    let isRepeat = false
    sockets.forEach(socket => {
      if (socket === socketId) {
        isRepeat = true
      }
    })
    if (!isRepeat) {
      this.sockets.push(socketId)
      return true
    }
    return false
  }

  removeSocket(socketId) {
    let { sockets } = this
    let position = null
    sockets.forEach((socket, index) => {
      if (socket === socketId) {
        position = index
      }
    })
    if (position !== null) {
      this.sockets.splice(position, 1)
      return true
    }
    return false
  }

}

export default User
