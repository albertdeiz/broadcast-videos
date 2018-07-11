import React, { Component } from 'react'

class Room extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-12">
          <h1>Room {this.props.match.params.id}</h1>
        </div>
      </div>
    )
  }
}

export default Room
