import React from 'react'
import ReactDOM from 'react-dom'
import { createFederatedReact } from '@vf/federated-react'
import { initFederatedRuntime } from '@vf/federated-core'
import Footer from './Footer'

const { name, mount, unmount, bootstrap, update } = createFederatedReact({
  React,
  ReactDOM,
  federatedRuntime: initFederatedRuntime(),
  config: {
    name: 'vfuk-federated-component-example',
    rootComponent: Footer,
    type: 'component',
  },
})

export { name, mount, unmount, bootstrap, update }
