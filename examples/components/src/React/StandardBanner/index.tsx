import React from 'react'
import ReactDOM from 'react-dom'
import { createFederatedReact } from '@vf/federated-react'
import { getFederatedRuntime } from '@vf/federated-core'
import StandardBanner from './StandardBanner'

const { name, scope, mount, unmount, bootstrap, update } = createFederatedReact(
  {
    React,
    ReactDOM,
    federatedRuntime: getFederatedRuntime(),
    config: {
      name: 'FederatedStandardBanner',
      scope: 'vfuk-federated-component-example',
      rootComponent: StandardBanner,
      type: 'component',
    },
  }
)

export { name, scope, mount, unmount, bootstrap, update }
