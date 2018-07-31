import { AUTH_REQUEST, AUTH_ERROR, AUTH_SUCCESS, AUTH_CLOSE, RESET_AUTH_MESSAGE } from '../actions/auth'

const initialState = {
  isFetching: false,
  error: false,
  success: false,
  message: {
    id: null,
    detail: '',
    type: '',
    data: null
  },
  isLoggedin: false,
  token: null,
  data: {},
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_REQUEST:
      return Object.assign({}, state, {isFetching: true, success: false, error: false, isLoggedin: false, token: initialState.token, data: initialState.data, message: initialState.message})
    case AUTH_SUCCESS:
      return Object.assign({}, state, {isFetching: false, success: true, isLoggedin: true, token: action.payload.token, data: action.payload.data, message: action.payload.message})
    case AUTH_ERROR:
      return Object.assign({}, state, {isFetching: false, error: true, message: action.payload.message})
    case AUTH_CLOSE:
      return Object.assign({}, initialState, {isLoggedin: initialState.isLoggedin, token: initialState.token, data: initialState.data, message: initialState.message})
    case RESET_AUTH_MESSAGE:
      return Object.assign({}, initialState, {message: initialState.message})
    default:
      return state
  }
}

export default authReducer