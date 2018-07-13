import React, { Component } from 'react'
import Proptypes from 'prop-types'
import { Link } from 'react-router-dom'

class AppBar extends Component {
  render() {
    const { isLogged, user } = this.props 
    let username = isLogged ? user.name: 'Guest'
    return (
      <nav className="col-12 navbar navbar-light bg-light">
        <a className="navbar-brand">Hi, {username}!</a>
        <ul className="nav justify-content-end">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/room/100" className="nav-link">Room 100</Link>
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
