import React, { Component } from 'react'
import Proptypes from 'prop-types'

class Playlist extends Component {
  handleClickItem = index => e => {
    e.preventDefault()
    const { onClickItem } = this.props
    if (!onClickItem) {
      console.log(onClickItem)
      return false
    }
    return onClickItem(index)
  }

  render() {
    const { list } = this.props
    return (
      <ul>
        {list.map((item, index) => (<li key={index}>
          <a onClick={this.handleClickItem(index)}>
            <img src={item.snippet.thumbnails.default.url} alt={item.snippet.title} title={item.snippet.title}/>
            {item.snippet.title}
          </a>
        </li>))}
      </ul>
    )
  }
}

Playlist.prototypes = {
  list: Proptypes.array.isRequired,
  onClickItem: Proptypes.func.isRequired

}

export default Playlist