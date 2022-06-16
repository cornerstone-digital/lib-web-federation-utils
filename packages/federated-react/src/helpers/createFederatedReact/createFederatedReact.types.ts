import React, { ComponentType } from 'react'
import ReactDOM from 'react-dom'

import {
  RuntimeEventHandler,
  FederatedModuleTypes,
  FederatedRuntimeType,
  FederatedModuleBaseOptions,
  FederatedModuleLifecycles,
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
    loadRootComponent?: () => Promise<{
      default: React.ReactElement | ComponentType<RootComponentProps>
    }>
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
    eventListeners?: Record<string, RuntimeEventHandler>
  }
  renderType?: RenderTypes | (() => RenderTypes)
  React: typeof React
  ReactDOM: typeof ReactDOM
  federatedRuntime: FederatedRuntimeType
  enableSystemJs?: boolean
}

export type FederatedReactApp<PropsType> = FederatedModuleBaseOptions<
  PropsType,
  'react'
> &
  FederatedModuleLifecycles<PropsType> & {
    domElementId: CreateFederatedReactOptions<PropsType>['config']['domElementId']
    loadRootComponent: CreateFederatedReactOptions<PropsType>['config']['loadRootComponent']
  }
