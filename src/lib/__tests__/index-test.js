/* global describe, it, expect */
import React, { Component } from 'react'

import reactRouterFetch from 'lib/index'

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

class Home2 extends Component {
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

const routes2 = [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: Home2
      }
    ]
  }
]

const routes3 = [
  {
    path: '/',
    exact: true,
    component: App
  }
]

describe('react-router-fetch', function () {
  it('can be imported', function () {
    expect(reactRouterFetch).toBeTruthy()
  })
  it('will call fetch on a route handler if it has one', function (done) {
    reactRouterFetch(routes, { pathname: '/' })
      .then((results) => {
        expect(results[0].test).toBe('1234')
        done()
      })
  })
  it('will resolve with empty if no fetch exists', function (done) {
    reactRouterFetch(routes2, { pathname: '/' })
      .then((results) => {
        expect(results).toBeUndefined()
        done()
      })
  })
  it('will resolve with empty if no match', function (done) {
    reactRouterFetch(routes3, { pathname: '/test' })
      .then((results) => {
        expect(results).toBeUndefined()
        done()
      })
  })
})
