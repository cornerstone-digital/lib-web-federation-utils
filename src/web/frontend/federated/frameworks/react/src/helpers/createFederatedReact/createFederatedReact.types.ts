import React from 'react'
import ReactDOM from 'react-dom'
import { ValidateFunction } from 'ajv'
import { FederatedRuntime, RuntimeEventHandler } from '@vf/federated-web-core/dist/src'

export type CreateFederatedReactOptions<RootComponentProps> = {
  config: {
    scope: string
    name: string
    description?: string
    domElementId: string
    rootComponent: React.ComponentClass<RootComponentProps, any> | React.FunctionComponent<RootComponentProps>
    errorBoundary?: React.ComponentClass<unknown, unknown> | React.FunctionComponent<unknown>
    defaultProps?: RootComponentProps
    propValidationFunction?: ValidateFunction<RootComponentProps>
    activeWhenPaths?: string[]
    eventListeners?: Record<string, RuntimeEventHandler>
  }
  React: typeof React
  ReactDOM: typeof ReactDOM
  federatedRuntime: FederatedRuntime | void
}
