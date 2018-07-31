import socketIOClient from 'socket.io-client'

const initialState = socketIOClient(`${process.env.REACT_APP_SOCKETS_URL}:${process.env.REACT_APP_SOCKETS_PORT}`)

const socketReducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state
  }
}

export default socketReducer