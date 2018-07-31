import { createStore, applyMiddleware } from 'redux'
import reducer from './reducers/index'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
const loggerMiddleware = createLogger()

const store = createStore(
  reducer,
  applyMiddleware(
    thunk,
    loggerMiddleware
  )
)

export default store;