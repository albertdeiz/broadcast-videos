import React from "react"
import Root from "./root"
import {
  BrowserRouter,
  Route,
  Switch
} from "react-router-dom"
import Home from './views/home'
import Room from './views/room'

const Routes = () => (
  <BrowserRouter>
    <Root>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/room/:id" exact component={Room}/>
        <Route component={NoMatch} />
      </Switch>
    </Root>
  </BrowserRouter>
)

const NoMatch = ({ location }) => (
  <div>
    <h1>Error</h1>
  </div>
)

export default Routes
