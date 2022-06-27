import React from 'react'
import ReactDOM from 'react-dom'

import {
  FederatedModuleTypes,
  FederatedModuleBaseOptions,
  FederatedModuleLifecycles,
  AbstractFederatedRuntime,
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
    rootComponent?: React.ComponentType<RootComponentProps>
    loadRootComponent?: () => Promise<
      React.ComponentClass<unknown, unknown> | React.FunctionComponent<unknown>
    >
    errorBoundary?: (
      error: Error
    ) => React.ReactElement<
      unknown,
      string | React.FunctionComponent | typeof React.Component
    > | null
    defaultProps?: RootComponentProps
    propValidationFunction?: (props: RootComponentProps) => boolean
    activeWhenPaths?: string[]
    exceptWhenPaths?: string[]
  }
  renderType?: RenderTypes | (() => RenderTypes)
  React: typeof React
  ReactDOM: typeof ReactDOM
  federatedRuntime: AbstractFederatedRuntime
  enableSystemJs?: boolean
}

export type FederatedReactApp<PropsType> =
  FederatedModuleBaseOptions<PropsType> &
    FederatedModuleLifecycles<PropsType> & {
      domElementId: CreateFederatedReactOptions<PropsType>['config']['domElementId']
      loadRootComponent: CreateFederatedReactOptions<PropsType>['config']['loadRootComponent']
    }
