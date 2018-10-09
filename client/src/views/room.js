import React, { Component } from 'react'
import { connect } from 'react-redux'
import YoutubePlayer from './../components/YoutubePlayer'
import MobileBroadcast from './../components/MobileBroadcast'
import Playlist from './../components/Playlist'
import { BrowserView, MobileView } from 'react-device-detect'

class Room extends Component {
  constructor(props) {
    super(props)
    this.state = {
      room: null
    }

    this.props.socket.on('playlist:add', playlist => {
      this.setState({
        room: {
          ...this.state.room,
          playlist
        }
      })
    })

    this.props.socket.on('playlist:setIndex', newIndex => {
      this.setState({
        room: {
          ...this.state.room,
          indexPlaylist: newIndex
        }
      })
    })
  }

  componentWillMount() {
    const { match, auth } = this.props
    if (auth.token) {
      this.joinRoom(match.params.id)
    }

    this.props.socket.on('newMessage', message => {
      console.log(message)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { match, auth } = this.props
    if (auth.token !== null && auth.token !== prevProps.auth.token) {
      this.joinRoom(match.params.id)
    }
  }

  joinRoom = (roomId, callback) => {
    const { auth, socket, history } = this.props
    const data = {
      token: auth.token,
      data: { roomId }
    }
    socket.emit('joinRoom', data, (err, room) => {
      if (err) {
        history.push('/')
      } else {
        this.setState({room})
      }
    })
  }

  setNextVideo = () => {
    const { room } = this.state
    const { playlist, indexPlaylist } = room
    if (playlist[indexPlaylist + 1]) {
      this.setIndexPlaylist(indexPlaylist + 1)
      return true
    }
    return false
  }

  setIndexPlaylist = index => {
    const { auth, socket } = this.props
    const data = {
      token: auth.token,
      data: { indexPlaylist: index }
    }
    socket.emit('playlist:setIndex', data, (err, newIndex) => {
      if (err) {
        console.log(err)
      } else {
        this.setState({
          room: {
            ...this.state.room,
            indexPlaylist: newIndex
          }
        })
      }
    })
  }

  render() {
    const { room } = this.state
    const { auth, socket } = this.props
    if (room) {
      return (
        <div className="row">
          <div className="col-12">
            <h1>Room {room ? room.name : ''}</h1>
          </div>
          <div className="col-12">
            <Playlist list={room.playlist} onClickItem={this.setIndexPlaylist}/>
          </div>
          <div className="col-12">
            <BrowserView>
              <YoutubePlayer playlist={room.playlist} indexPlaylist={room.indexPlaylist} onVideoEnd={this.setNextVideo}/>
            </BrowserView>
            <MobileView>
              <MobileBroadcast token={auth.token} room={room} socket={socket}/>
            </MobileView>
          </div>
        </div>
      )
    } else {
      return (
        <div className="row">
          <div className="col-12">
            <h1>Cargando...</h1>
          </div>
        </div>
      )
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  socket: state.socket
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Room)
