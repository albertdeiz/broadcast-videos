import React, { Component } from 'react'
import { connect } from 'react-redux'
import MobileBroadcast from './../components/MobileBroadcast'
import CreateForm from './../components/CreateForm'
import YoutubePlayer from './../components/YoutubePlayer'
import { BrowserView, MobileView } from 'react-device-detect'
import { join } from './../actions/auth'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      connected: false
    }
  }

  componentWillMount() {
    this.props.socket.on('connect', () => {
      this.setState({connected: true})
    })

    this.props.socket.on('disconnect', rooms => {
      this.setState({
        connected: false
      })
    })
  }

  render() {
    const { connected } = this.state
    const { auth } = this.props
    return !auth.isLoggedin ? (
        <div className="row justify-content-md-center" style={{marginTop: 30}}>
          <div className="col-md-6 col-sm-12">
            <h2>Join the experience,<br />
            <small className="text-muted">is easy!</small><br />
            <small className="text-muted">you are {connected ? 'online' : 'offline'}</small></h2>
            <CreateForm
              onSubmit={this.props.join}
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
      ) : (
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
                <MobileBroadcast token={this.state.token} room={this.state.currentRoom} socket={this.props.socket}/>
              </MobileView>
            )}
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
  join: (user) => dispatch(join(user)) 
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)

