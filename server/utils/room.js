class Room {
  constructor(id, name) {
    if (!id) {
      throw('constructor have to be initiated with an id')
    }
    this.playlist = []
    this.indexPlaylist = 0
    this.name = name || 'Crazy Party'
    this.id = id
  }

  addToPlaylist(item) {
    this.playlist.push(item)
    return this.playlist
  }

  removeFromPlaylist(index) {
    this.playlist = this.playlist.splice(index, i)
    return this.playlist
  }

  getFromPlaylist(index) {
    return this.playlist[index]
  }

  setIndexList(index) {
    this.indexPlaylist = index
    return this.indexPlaylist
  }
}

export default Room