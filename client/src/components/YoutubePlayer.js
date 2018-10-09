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

  _onReady = event => {
    event.target.playVideo()
  }

  _onEnd = event => {
    this.props.onVideoEnd()
  }

  _onError = event => {
    console.log('err', event.target)
    this.props.onVideoEnd()
  }

  render() {
    const { opts } = this.state
    const { playlist, indexPlaylist } = this.props
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
