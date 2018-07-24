import { isRealString } from './validation'

class User {
  constructor(user = {}) {
    this.data = {}
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
}

export default User
