import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import AppBar from './components/AppBar'
import { logout } from './actions/auth'
// import QRCode from 'qrcode'
// QRCode.toDataURL('I am a pony!')
//   .then(url => {
//     console.log(url)
//   })
//   .catch(err => {
//     console.error(err)
//   })
// https://www.npmjs.com/package/qrcode

// Making the App component
class Root extends Component {
  constructor(props) {
    super(props)
    this.state = {
      connected: false,
      rooms: [],
      currentRoom: null,
      token: null
    }

    this.props.socket.on('updateRoomNames', rooms => {
      this.setState({rooms})
    })
  }

  render() {
    const { auth } = this.props
    return (
      <div className="container-fluid">
        <div className="row">
          <AppBar isLogged={auth.isLoggedin} user={auth.data} onLogout={this.props.logout}/>
        </div>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  socket: state.socket
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()) 
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Root))
