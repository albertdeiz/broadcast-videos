import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'
import AppBar from './components/AppBar'
import Broadcast from './components/Broadcast'
import ListRooms from './components/ListRooms'
import CreateForm from './components/CreateForm'

// Making the App component
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: socketIOClient('http://localhost:4113'),
      connected: false,
      auth: false,
      user: {},
      rooms: []
    }

    this.state.socket.on('connect', () => {
      this.setState({connected: true})
      console.log(`status: ${'online'}`)
    })

    this.state.socket.on('updateRoomNames', rooms => {
      this.setState({rooms})
    })

    this.state.socket.on('disconnect', rooms => {
      this.setState({connected: false})
      console.log(`status: ${'offline'}`)
    })
  }

  handleChange = e => {
    this.setState({username: e.target.value})
  }

  // User Methods

  joinUser = username => {
    this.state.socket.emit('join', username, this.joinUserSuccess)
  }

  joinUserSuccess = (err, user) => {
    if (err) {
      console.log(err)
      return
    }
    this.setState({user, auth: true, username: ''})
  }

  // Room Methods

  joinRoom = roomId => e => {
    e.preventDefault()
    this.state.socket.emit('joinRoom', roomId, this.joinRoomSuccess)
  }

  joinRoomSuccess = (err, room) => {
    if (err) {
      console.log(err)
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
            <div className="col-6">
              <h2>Join the experience,<br />
              <small className="text-muted">is easy!</small></h2>
              <CreateForm onSubmit={this.joinUser} label="Username" prependLabel="@" buttonLabel="Join"/>
            </div>
          </div>
        )}
        {this.state.auth && (
          <div className="row">
            <div className="col-4">
              <CreateForm onSubmit={this.createRoom} label="Room" prependLabel="#" buttonLabel="Create" pullRight={true}/>
              {this.state.auth && (
                <ListRooms rooms={this.state.rooms} onSelectRoom={this.joinRoom} activeRoom={this.state.user.room}/>
              )}
            </div>
            <div className="col-8">
              <Broadcast room={this.state.user.room}/>
            </div>
          </div>
        )}
        {/* this.props.children */}
      </div>
    )
  }
}

export default App
