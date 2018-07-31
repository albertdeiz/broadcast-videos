import React, { Component } from 'react'
import Proptypes from 'prop-types'
import YouTube from 'react-youtube'

class YoutubePlayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      indexPlaylist: 0,
      opts: {
        height: '390',
        width: '640',
        playerVars: {
          autoplay: 1
        }
      }
    }
  }

  setNextVideo = () => {
    const { indexPlaylist } = this.state
    const { playlist } = this.props
    if (playlist[indexPlaylist + 1]) {
      this.setState({ indexPlaylist: indexPlaylist + 1 })
      return true
    }
    return false
  }

  handleClickItem = i => e => {
    e.preventDefault()
    this.setState({ indexPlaylist: i })
  }

  _onReady = event => {
    event.target.playVideo()
  }

  _onEnd = event => {
    this.setNextVideo()
  }

  _onError = event => {
    console.log('err', event.target)
    this.setNextVideo()
  }

  render() {
    const { opts, indexPlaylist } = this.state
    const { playlist } = this.props
    const videoId = playlist[indexPlaylist] ? playlist[indexPlaylist].id.videoId : null
    if (videoId) {
      return (
        <div className="youtube-player" style={{display: 'flex'}}>
          <YouTube
            videoId={videoId}
            opts={opts}
            onReady={this._onReady}
            onEnd={this._onEnd}
            onError={this._onError}
          />
          <ul>
            {playlist.map((item, index) => (<li key={index}>
              <a onClick={this.handleClickItem(index)}>
                <img src={item.snippet.thumbnails.default.url} alt={item.snippet.title} title={item.snippet.title}/>
                {item.snippet.title}
              </a>
            </li>))}
          </ul>
        </div>
      )
    } else {
      return (
        <h1>Empty list :(</h1>
      )
    }
  }
}

YoutubePlayer.prototypes = {
  playlist: Proptypes.array.isRequired
}

export default YoutubePlayer
