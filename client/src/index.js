import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Routes from './routes'
import store from './store'
import { validateToken } from './actions/auth'
import registerServiceWorker from './registerServiceWorker'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      store: store,
      token: window.localStorage.getItem('token-app')
    }
  }

  componentDidMount() {
    const { store, token } = this.state
    if (token) {
      store.dispatch(validateToken(token))
    }
  }
  
  render() {
    return (
      <Provider store={this.state.store}>
        <Routes />
      </Provider>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
registerServiceWorker()
