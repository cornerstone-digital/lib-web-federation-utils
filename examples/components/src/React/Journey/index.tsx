import React from 'react'
import { initFederatedRuntime } from '@vf/federated-core'
import { createFederatedReact } from '@vf/federated-react'
import ReactDOM from 'react-dom'
import App from './App'

const {
  name,
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
  federatedRuntime: initFederatedRuntime(),
  config: {
    name: 'vfuk-federated-component-example',
    type: 'journey-module',
    activeWhenPaths: ['/', '/mixed'],
    exceptWhenPaths: [],
    domElementId: 'root',
    rootComponent: App,
  },
})

export {
  name,
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
