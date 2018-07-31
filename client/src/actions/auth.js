import utils from './../utils'

export const AUTH_REQUEST = 'AUTH_REQUEST'
export const AUTH_ERROR = 'AUTH_ERROR'
export const AUTH_SUCCESS = 'AUTH_SUCCESS'
export const AUTH_CLOSE = 'AUTH_CLOSE'
export const RESET_AUTH_MESSAGE = 'RESET_AUTH_MESSAGE'

export const resetMessage = () => {
  return {
    type: RESET_AUTH_MESSAGE
  }
}

export const logout = () => {
  return (dispatch, getState) => {
    window.localStorage.removeItem('token-app')
    dispatch({
      type: AUTH_CLOSE
    })
  }
}

export const validateToken = token => {
  try {
    utils.parseJwt(token)
  } catch(e) {
    return authenticationError('token no válido')
  }
  return authenticationSuccess(token)
}

export const join = (user) => {
  return (dispatch, getState) => {
    dispatch(authenticationRequest())
    getState().socket.emit('join', user, (err, data, token) => {
      if (err) {
        return dispatch(authenticationError({message: err}))
      } else {
        return dispatch(authenticationSuccess(token))
      }
    })
  }
}

const authenticationRequest = () => {
  return {
    type: AUTH_REQUEST
  }
}

const authenticationError = (err) => {
  return {
    type: AUTH_ERROR,
    payload: {
      message: {
        id: AUTH_ERROR,
        type: 'error',
        detail: err.message,
        data: err.data,
      }
    }
  }
}

const authenticationSuccess = (token) => {
  window.localStorage.setItem('token-app', token)
  return {
    type: AUTH_SUCCESS,
    payload: {
      token,
      data: utils.parseJwt(token),
      message: {
        id: AUTH_SUCCESS,
        type: 'success',
        detail: 'susscess',
        data: null,
      }
    }
  }
}

export default {
  resetMessage,
  logout,
  join
}