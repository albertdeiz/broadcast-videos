import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import AppBar from './components/AppBar'
import Broadcast from './components/Broadcast'
import MobileBroadcast from './components/MobileBroadcast'
import ListRooms from './components/ListRooms'
import CreateForm from './components/CreateForm'
import YoutubePlayer from './components/YoutubePlayer'
import { BrowserView, MobileView } from 'react-device-detect'
import QRCode from 'qrcode'
// QRCode.toDataURL('I am a pony!')
//   .then(url => {
//     console.log(url)
//   })
//   .catch(err => {
//     console.error(err)
//   })
// https://www.npmjs.com/package/qrcode

// Making the App component
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: socketIOClient(`${process.env.REACT_APP_SOCKETS_URL}:${process.env.REACT_APP_SOCKETS_PORT}`),
      connected: false,
      auth: false,
      user: {},
      rooms: [],
      currentRoom: null,
      token: null
    }

    this.state.socket.on('connect', () => {
      this.setState({connected: true})
    })

    this.state.socket.on('updateRoomNames', rooms => {
      this.setState({rooms})
    })

    this.state.socket.on('playlist:add', playlist => {
      this.setState({
        currentRoom: {
          ...this.state.currentRoom,
          playlist
        }
      })
    })

    this.state.socket.on('disconnect', rooms => {
      this.setState({
        connected: false
      })
    })
  }

  componentWillMount() {
    const token = window.localStorage.getItem('token-app')
    if (token) {
      this.state.socket.emit('token', {token, data: null}, (err, user, room) => {
        if (!err) {
          this.setState({
            token,
            auth: true,
            user,
            currentRoom: room
          })
        } else {
          console.log('error on token ', err)
        }
      })
    }
  }

  handleChange = e => {
    this.setState({username: e.target.value})
  }

  // User Methods

  joinUser = user => {
    this.state.socket.emit('join', user, this.joinUserSuccess)
  }

  joinUserSuccess = (err, data, token) => {
    if (err) {
      alert(`error joining user: ${err}`)
      return
    }
    this.setState({
      user: data,
      token,
      auth: true,
      username: ''
    })
    window.localStorage.setItem('token-app', token)
  }

  // Room Methods

  joinRoom = roomId => e => {
    e.preventDefault()
    this.state.socket.emit('joinRoom', {
      token: this.state.token,
      data: {
        roomId
      }
    }, this.joinRoomSuccess)
  }

  joinRoomSuccess = (err, room) => {
    if (err) {
      alert(`error joining room: ${err}`)
      return
    } else {
      this.setState({
        currentRoom: room,
        user: {
          ...this.state.user,
          roomId: room.id
        }
      })
    }
  }

  createRoom = roomname => {
    console.log('will create ' + roomname)
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <AppBar isLogged={this.state.auth} user={this.state.user}/>
        </div>
        {!this.state.auth && (
          <div className="row justify-content-md-center" style={{marginTop: 30}}>
            <div className="col-md-6 col-sm-12">
              <h2>Join the experience,<br />
              <small className="text-muted">is easy!</small><br />
              <small className="text-muted">you are {this.state.connected ? 'online' : 'offline'}</small></h2>
              <CreateForm
                onSubmit={this.joinUser}
                labels={[{
                  name: 'username',
                  description: 'Username',
                  prepend: '@'
                },
                {
                  name: 'password',
                  description: 'Password',
                  type: 'password'
                }]}
                buttonLabel="Join"/>
            </div>
          </div>
        )}
        {this.state.auth && (
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <CreateForm
                onSubmit={this.createRoom}
                labels={[{
                  name: 'room',
                  description: 'Room',
                  prepend: '#'
                }]}
                buttonLabel="Create" pullRight={true}/>
              {this.state.auth && (
                <ListRooms rooms={this.state.rooms} onSelectRoom={this.joinRoom} activeRoom={this.state.user.roomId}/>
              )}
            </div>
            <div className="col-md-8 col-sm-12">
              {this.state.currentRoom && (
                <BrowserView>
                  <h1>{this.state.currentRoom.name}</h1>
                  <YoutubePlayer playlist={this.state.currentRoom.playlist}/>
                </BrowserView>
              )}
              {this.state.currentRoom && (
                <MobileView>
                  <MobileBroadcast token={this.state.token} room={this.state.currentRoom} socket={this.state.socket}/>
                </MobileView>
              )}
            </div>
          </div>
        )}
        {/* this.props.children */}
      </div>
    )
  }
}

export default App
