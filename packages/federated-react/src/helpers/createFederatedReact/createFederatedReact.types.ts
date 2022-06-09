import React from 'react'
import ReactDOM from 'react-dom'

import {
  RuntimeEventHandler,
  FederatedModuleTypes,
  FederatedRuntimeType,
} from '@vf/federated-core'

export type RenderTypes =
  | 'createRoot'
  | 'unstable_createRoot'
  | 'createBlockingRoot'
  | 'unstable_createBlockingRoot'
  | 'hydrate'
  | 'render'

export type CreateFederatedReactOptions<RootComponentProps> = {
  config: {
    scope: string
    name: string
    type: FederatedModuleTypes
    description?: string
    domElementId?: string
    rootComponent?:
      | React.ComponentClass<RootComponentProps, unknown>
      | React.FunctionComponent<RootComponentProps>
    loadRootComponent?: () => Promise<
      | React.ComponentClass<RootComponentProps, unknown>
      | React.FunctionComponent<RootComponentProps>
    >
    defaultProps?: RootComponentProps
    propValidationFunction?: (props: RootComponentProps) => boolean
    activeWhenPaths?: string[]
    exceptWhenPaths?: string[]
    eventListeners?: Record<string, RuntimeEventHandler>
  }
  renderType?: RenderTypes | (() => RenderTypes)
  React: typeof React
  ReactDOM: typeof ReactDOM
  federatedRuntime: FederatedRuntimeType | void
}
