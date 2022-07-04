import React from 'react'
import ReactDOM from 'react-dom'
import { createFederatedReact } from '@vf/federated-react'
import { getFederatedRuntime } from '@vf/federated-core'
import Footer from './Footer'

const { name, scope, mount, unmount, bootstrap, update } = createFederatedReact(
  {
    React,
    ReactDOM,
    federatedRuntime: getFederatedRuntime(),
    config: {
      name: 'FederatedFooter',
      scope: 'vfuk-federated-component-example',
      rootComponent: Footer,
      type: 'component',
    },
  }
)

export { name, scope, mount, unmount, bootstrap, update }