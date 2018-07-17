import React, { Component } from 'react'
import Proptypes from 'prop-types'
import youtubeSearch from 'youtube-api-v3-search'

class MobileBroadcast extends Component {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      message: '',
      results: [],
      q: '',
      timeout: null
    }

    this.props.socket.on('newMessage', message => {
      this.setState({
        messages: [...this.state.messages, message]
      })
    })
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.room && nextProps.room.id !== this.props.room.id) {
      const lastMessage = this.state.messages[this.state.messages.length - 1]
      this.setState({messages: [lastMessage]})
    }
  }

  handleSendVideo = item => e => {
    e.preventDefault()
    this.props.socket.emit('createVideoMessage', item, this.sendVideoSuccess)
  }

  sendVideoSuccess = (err, message) => {
    if (err) {
      alert(`error sending message: ${err}`)
      return
    }
  }

  handleType = e => {
    if (this.state.timeout) {
      clearTimeout(this.state.timeout)
    }
    this.setState({
      q: e.target.value
    })
    if (e.target.value.length >= 3) {
      this.setState({
        timeout: setTimeout(() => {
          youtubeSearch(
            'AIzaSyBzCJpPBMHmQn1ZAIl5M7lOrnb0gZinbn4', 
            {
              q: this.state.q,
              part:'snippet',
              type:'video'
            },
            (err, results) => {
              this.setState({results: results.items})
            }
          )
        }, 1000)
      })
    } else {
      this.setState({results: []})
    }
  }

  render() {
    const { room } = this.props
    return (
      <div className="jumbotron jumbotron-fluid">
        {!room && (
          <div className="container">
            <h1 className="display-4">Select Room</h1>
            <p className="lead">You have to select a room to join a funny experience</p>
          </div>
        )}
        {room && (
          <div>
            <form className="form-inline col-12">
              <div className="form-group mx-sm-3 mb-2">
                <label htmlFor="q" className="sr-only">Video</label>
                <input onChange={this.handleType} value={this.state.q} type="text" className="form-control" id="q" placeholder="Video" />
              </div>
            </form>
            <ul>
              {this.state.results.map(item => {
                return (
                  <li key={item.id.videoId} onClick={this.handleSendVideo(item)}>{item.snippet.title}</li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    )
  }
}

MobileBroadcast.prototypes = {
  room: Proptypes.object.isRequired
}

export default MobileBroadcast
