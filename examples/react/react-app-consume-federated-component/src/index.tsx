import React from 'react'
import { initFederatedRuntime } from '@vf/federated-core'
import { render } from 'react-dom'
import App from './App'

const runtime = initFederatedRuntime()
runtime.debugEnabled = true
runtime.importMapOverridesEnabled = true
runtime.addImportMapOverridesUi()
render(<App />, document.getElementById('root'))
