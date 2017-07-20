react-router-fetch
=====================
module to loop through matched react router handler to call fetch methods for specifying data needs at the handler level

[![Dependency Status](https://david-dm.org/kellyrmilligan/react-router-fetch.svg)](https://david-dm.org/kellyrmilligan/react-router-fetch)
[![Build Status](https://travis-ci.org/kellyrmilligan/react-router-fetch.svg?branch=master)](https://travis-ci.org/kellyrmilligan/react-router-fetch)
[![Coverage Status](https://coveralls.io/repos/github/kellyrmilligan/react-router-fetch/badge.svg?branch=master)](https://coveralls.io/github/kellyrmilligan/react-router-fetch?branch=master)

## Why?
I wanted a nice and contained module to be able to initiate requests for route handlers in an app, so that the data would be loaded before the route handler was rendered. This module doesn't accomplish that on it's own, but can be used as a part of a solution to that problem.


## Usage
react router fetch wraps [react-router-config](https://www.npmjs.com/package/react-router-config) `matchRoutes`. It then will go through the routes in a similar fashion as the `README` suggests.
```js
const App = (props) => (
  <div />
)

class Home extends Component {
  static fetch () {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 1000, { test: '1234' })
    })
  }
  render () {
    return (
      <div>Home</div>
    )
  }
}

const routes = [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home
      }
    ]
  }
]

reactRouterFetch(routes, { pathname: '/' })
  .then((results) => {
    //the results of the fetching are also here if you need them.
  })
```

in a component you would want to pass the `this.props.location` from react-router in order to have full access to that in the static fetch method on the component.


## Specifying route data needs
This allows you to specify at the route handler level what data that route needs via a static fetch method. The fetching itself should be wired up to redux via thunks, or whatever way you want to handle that. the only requirement is that the static method returns a promise.

```js
import React, { Component } from 'react'

class Page extends Component {

  static fetch(match, location, options) {
    //return a promise to be resolved later, superagent as an example
    return request('GET', '/search')
  }

  render() {
    //your stuff
  }
}

```

This module is intended to be a building block for other modules or as a low level part of your application.

## Using in a top level component
Assuming you have a top level component, you can export it using `withRouter` to get the location prop injected into your component.

```js
import React, { Component } from 'react'
import { withRouter } from 'react-router'
import reactRouterFetch from 'react-router-fetch'

class App extends Component {

  state = {
    isAppFetching: false,
    appFetchingError: null
  }

  componentWillMount () {
    this.fetchRoutes(this.props)
  }

  componentWillReceiveProps (nextProps) {
    const current = `${this.props.location.pathname}${this.props.location.search}`
    const next = `${nextProps.location.pathname}${nextProps.location.search}`
    if (current === next) {
     return
    }
    this.fetchRoutes(nextProps)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !nextState.isAppFetching
  }

  fetchRoutes (props) {
    const { dispatch, location } = props
    this.setState({
      isAppFetching: true,
      appFetchingError: null
    })
    //maybe show a progress bar somewhere outside of react? go nuts!!
    reactRouterFetch(routeConfig, location, { dispatch })
      .then((results) => {
        this.setState({
          isAppFetching: false
        })
      })
      .catch((err) => {
        this.setState({
          isAppFetching: false,
          appFetchingError: err
        })
      })
  }

  render () {
    //do something with isAppFetching for the first render if single page app.
    // after the first render, the page contents will stay put until the next route's data is ready to go, so you'll have to do something outside of this.
    return (
      ...
    )
  }

}


const connectedApp = connect()(App)
export default withRouter(connectedApp)

```
