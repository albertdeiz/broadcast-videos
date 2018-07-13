import React, { Component } from 'react'
import Proptypes from 'prop-types'

class Broadcast extends Component {
  render() {
    const { room } = this.props
    console.log('current room:', this.props.room)
    return (
      <div className="jumbotron jumbotron-fluid">
        {!room && (
          <div className="container">
            <h1 className="display-4">Select Room</h1>
            <p className="lead">You have to select a room to join a funny experience</p>
          </div>
        )}
        {room && (
          <div className="container">
            <h1 className="display-4">Room #{room.name}</h1>
            <p className="lead">You joined in {room.name} with the id {room.id}</p>
          </div>
        )}
      </div>
    )
  }
}

Broadcast.prototypes = {
  room: Proptypes.object.isRequired
}

export default Broadcast
