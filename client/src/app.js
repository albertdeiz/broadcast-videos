import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import AppBar from './components/AppBar'
import Broadcast from './components/Broadcast'
import MobileBroadcast from './components/MobileBroadcast'
import ListRooms from './components/ListRooms'
import CreateForm from './components/CreateForm'
import { BrowserView, MobileView } from 'react-device-detect'

// Making the App component
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: socketIOClient(`${process.env.REACT_APP_SOCKETS_URL}:${process.env.REACT_APP_SOCKETS_PORT}`),
      connected: false,
      auth: false,
      user: {},
      rooms: []
    }

    this.state.socket.on('connect', () => {
      this.setState({connected: true})
    })

    this.state.socket.on('updateRoomNames', rooms => {
      this.setState({rooms})
    })

    this.state.socket.on('disconnect', rooms => {
      this.setState({
        connected: false,
        auth: false,
        user: {}
      })
    })
  }

  handleChange = e => {
    this.setState({username: e.target.value})
  }

  // User Methods

  joinUser = user => {
    this.state.socket.emit('join', user, this.joinUserSuccess)
  }

  joinUserSuccess = (err, user) => {
    if (err) {
      alert(`error joining user: ${err}`)
      return
    }
    this.setState({
      user,
      auth: true,
      username: ''
    })
  }

  // Room Methods

  joinRoom = roomId => e => {
    e.preventDefault()
    this.state.socket.emit('joinRoom', roomId, this.joinRoomSuccess)
  }

  joinRoomSuccess = (err, room) => {
    if (err) {
      alert(`error joining room: ${err}`)
      return
    }
    this.setState({
      user: {
        ...this.state.user,
        room: room
      }
    })
  }

  createRoom = roomname => {
    console.log('will create ' + roomname)
  }

  // render

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
                <ListRooms rooms={this.state.rooms} onSelectRoom={this.joinRoom} activeRoom={this.state.user.room}/>
              )}
            </div>
            <div className="col-md-8 col-sm-12">
              <BrowserView>
                <Broadcast room={this.state.user.room} socket={this.state.socket}/>
              </BrowserView>
              <MobileView>
                <MobileBroadcast room={this.state.user.room} socket={this.state.socket}/>
              </MobileView>
            </div>
          </div>
        )}
        {/* this.props.children */}
      </div>
    )
  }
}

export default App
