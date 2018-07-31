import React, { Component } from 'react'
import { connect } from 'react-redux'

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
  }

  componentWillMount() {
    const { match, auth } = this.props
    if (auth.token) {
      this.joinRoom(match.params.id)
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { match, auth } = this.props
    if (auth.token !== null && auth.token !== prevProps.auth.token) {
      this.joinRoom(match.params.id)
    }
  }

  joinRoom = (roomId, callback) => {
    const data = {
      token: this.props.auth.token,
      data: { roomId }
    }
    this.props.socket.emit('joinRoom', data, (err, room) => {
      if (err) {
        this.props.history.push('/')
      } else {
        this.setState({room})
      }
    })
  }

  render() {
    const { room } = this.state
    return (
      <div className="row">
        <div className="col-12">
          <h1>Room {room ? room.name : ''}</h1>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  socket: state.socket
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Room)
