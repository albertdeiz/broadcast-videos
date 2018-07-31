import { combineReducers } from 'redux'
import authReducer from './auth'
import socketReducer from './socket'

const reducer = combineReducers({
  auth: authReducer,
  socket: socketReducer
})

export default reducer