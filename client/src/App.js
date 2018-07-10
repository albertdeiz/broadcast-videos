// import packages
import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'

// Making the App component
class App extends Component {
  constructor() {
    super()
    this.state = {
      color: 'white',
      socket: socketIOClient('http://localhost:4113')
    }
    this.state.socket.on('change color', (color) => {
      console.log('change to', color)
      document.body.style.backgroundColor = color
    })
  }

  send = () => {
    console.log('send', this.state.color)
    this.state.socket.emit('change color', this.state.color)
  }

  setColor = (color) => {
    this.setState({ color })
  }

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <button onClick={() => this.send() }>Change Color</button>
        <button id="blue" onClick={() => this.setColor('blue')}>Blue</button>
        <button id="red" onClick={() => this.setColor('red')}>Red</button>
      </div>
    )
  }
}
export default App