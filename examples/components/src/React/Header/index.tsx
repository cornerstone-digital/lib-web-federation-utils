import React from 'react'
import ReactDOM from 'react-dom'
import { createFederatedReact } from '@vf/federated-react'
import { getFederatedRuntime } from '@vf/federated-core'
import Header from './Header'

const { name, scope, mount, unmount, bootstrap, update } = createFederatedReact(
  {
    React,
    ReactDOM,
    federatedRuntime: getFederatedRuntime(),
    config: {
      name: 'FederatedHeader',
      scope: 'vfuk-federated-component-example',
      rootComponent: Header,
      type: 'component',
    },
  }
)

export { name, scope, mount, unmount, bootstrap, update }
