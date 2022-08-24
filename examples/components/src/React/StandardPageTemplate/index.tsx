import React from 'react'
import ReactDOM from 'react-dom'
import { createFederatedReact } from '@vf/federated-react'
import { initFederatedRuntime } from '@vf/federated-core'
import StandardPageTemplate, { ThemeProvider } from './StandardPageTemplate'

const { name, scope, mount, unmount, bootstrap, update } = createFederatedReact(
  {
    React,
    ReactDOM,
    federatedRuntime: initFederatedRuntime(),
    config: {
      name: 'FederatedPageTemplate',
      scope: 'vfuk-federated-component-example',
      rootComponent: StandardPageTemplate,
      type: 'component',
    },
  }
)

export { name, scope, mount, unmount, bootstrap, update, ThemeProvider }
