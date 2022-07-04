import React from 'react'
import { getFederatedRuntime } from '@vf/federated-core'
import { render } from 'react-dom'
import App from './App'

const runtime = getFederatedRuntime()
runtime.debugEnabled = true
runtime.addBaseUrl('vfuk-federated-component-example', 'http://localhost:8001')
runtime.importMapOverridesEnabled = true
runtime.addImportMapOverridesUi()
render(<App />, document.getElementById('root'))
