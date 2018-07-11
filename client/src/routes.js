import React from "react"
import App from "./app"
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom"
import Home from './views/home'
import Room from './views/room'

const Routes = () => (
  <Router>
    <App>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/room/:id" exact component={Room} />
        <Route component={NoMatch} />
      </Switch>
    </App>
  </Router>
)

const NoMatch = ({ location }) => (
  <div>
    <h1>Error</h1>
  </div>
)

export default Routes
