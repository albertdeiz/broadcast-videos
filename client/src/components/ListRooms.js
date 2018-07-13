import React, { Component } from 'react'
import Proptypes from 'prop-types'
import classnames from 'classnames'

class ListRooms extends Component {
  renderItem(room) {
    const isActive = this.props.activeRoom && this.props.activeRoom.name === room.name
    return (
      <li
        key={room.id}
        onClick={this.props.onSelectRoom(room.id)}
        className={classnames('list-group-item', {active: isActive})} >
        {`#${room.name}`}
      </li>
    )
  }
  render() {
    return (
      <ul className="list-group">
        {this.props.rooms.map(room => this.renderItem(room))}
      </ul>
    )
  }
}

ListRooms.proptypes = {
  rooms: Proptypes.array.isRequired,
  onSelectRoom: Proptypes.func.isRequired,
  activeRoom: Proptypes.object.isRequired,
}

export default ListRooms
