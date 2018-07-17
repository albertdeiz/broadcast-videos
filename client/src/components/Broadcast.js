import React, { Component } from 'react'
import Proptypes from 'prop-types'
import YoutubePlayer from './YoutubePlayer'

class Broadcast extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      videos: []
    }

    this.props.socket.on('newMessage', message => {
      this.setState({
        messages: [...this.state.messages, message]
      })
    })

    this.props.socket.on('newVideoMessage', video => {
      this.setState({
        videos: [...this.state.videos, video]
      })
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.room && nextProps.room.id !== this.props.room.id) {
      const lastMessage = this.state.messages[this.state.messages.length - 1]
      this.setState({messages: [lastMessage]})
    }
  }

  render() {
    const { room } = this.props
    return !room ? (
      <div className="jumbotron jumbotron-fluid">
        <div className="container">
          <h1 className="display-4">Select Room</h1>
          <p className="lead">You have to select a room to join a funny experience</p>
        </div>
      </div>
    ) :
    (
      <div className="container">
        <p className="lead">You joined in {room.name} with the id {room.id}</p>
        <YoutubePlayer playlist={this.state.videos}/>
        <ul>
          {this.state.videos.map((video, i) => {
            return (
              <li key={i}>
                <img
                  src={video.snippet.thumbnails.default.url}
                  width={video.snippet.thumbnails.default.width}
                  height={video.snippet.thumbnails.default.height}
                  alt={video.snippet.title}/>
                <strong>{video.snippet.from}</strong> {video.snippet.title}
              </li>
            )
          })}
        </ul>
        <ul>
          {this.state.messages.map((message, i) => {
            return (
              <li key={i}><strong>{message.from}</strong> {message.text}</li>
            )
          })}
        </ul>
      </div>
    )
  }
}

Broadcast.prototypes = {
  room: Proptypes.object.isRequired
}

export default Broadcast
