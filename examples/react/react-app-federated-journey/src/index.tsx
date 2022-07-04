import React from 'react'
import { getFederatedRuntime } from '@vf/federated-core'
import { createFederatedReact } from '@vf/federated-react'
import ReactDOM from 'react-dom'
import App from './App'

var {
  name,
  scope,
  mount,
  unmount,
  bootstrap,
  update,
  exceptWhenPaths,
  activeWhenPaths,
  type,
  domElementId,
  status,
  rootComponent,
} = createFederatedReact({
  React,
  ReactDOM,
  federatedRuntime: getFederatedRuntime(),
  config: {
    scope: 'vfuk-federated-journey-example',
    name: 'ReactFederatedJourney',
    type: 'journey-module',
    activeWhenPaths: ['/', '/mixed'],
    exceptWhenPaths: ['/asasd'],
    domElementId: 'root',
    rootComponent: App,
  },
})

export {
  name,
  scope,
  bootstrap,
  mount,
  unmount,
  update,
  status,
  exceptWhenPaths,
  activeWhenPaths,
  type,
  domElementId,
  rootComponent,
}
