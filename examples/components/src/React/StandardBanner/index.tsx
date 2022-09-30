import React from 'react'
import ReactDOM from 'react-dom'
import { createFederatedReact } from '@vf/federated-react'
import { initFederatedRuntime } from '@vf/federated-core'
import StandardBanner from './StandardBanner'

const { name, mount, unmount, bootstrap, update } = createFederatedReact({
  React,
  ReactDOM,
  federatedRuntime: initFederatedRuntime(),
  config: {
    name: 'vfuk-federated-component-example',
    rootComponent: StandardBanner,
    type: 'component',
  },
})

export { name, mount, unmount, bootstrap, update }
