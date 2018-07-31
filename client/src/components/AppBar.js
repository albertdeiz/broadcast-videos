import React, { Component } from 'react'
import Proptypes from 'prop-types'
import { Link } from 'react-router-dom'

class AppBar extends Component {
  handleLogout = e => {
    e.preventDefault()
    this.props.onLogout()
  }

  render() {
    const { isLogged, user } = this.props 
    let username = isLogged ? user.username: 'Guest'
    return (
      <nav className="col-12 navbar navbar-light bg-light">
        <a className="navbar-brand">Hi, {username}!</a>
        <ul className="nav justify-content-end">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" onClick={this.handleLogout}>Logout</a>
          </li>
        </ul>
      </nav>
    )
  }
}

AppBar.proptypes = {
  isLogged: Proptypes.bool.isRequired,
  user: Proptypes.object
}

export default AppBar
