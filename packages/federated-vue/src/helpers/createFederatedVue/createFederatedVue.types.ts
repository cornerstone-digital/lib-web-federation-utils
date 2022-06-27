import * as Vue from 'vue'
import { Component } from 'vue'
import type {
  AbstractFederatedRuntime,
  FederatedModuleTypes,
} from '@vf/federated-core'
import type { ValidateFunction } from 'ajv'

type PropData = {
  [key: string]: unknown
}

export type CreateFederatedVueOptions<RootComponentProps> = {
  config: {
    scope: string
    name: string
    type: FederatedModuleTypes
    description?: string
    domElementId: string
    rootComponent: Component<RootComponentProps>
    loadRootComponent?: () => Promise<Component<RootComponentProps>>
    errorBoundary?: Component<unknown>
    defaultProps?: PropData | null | undefined
    propValidationFunction?: ValidateFunction<RootComponentProps>
    activeWhenPaths?: string[]
    exceptWhenPaths?: string[]
  }
  Vue: typeof Vue
  federatedRuntime: AbstractFederatedRuntime
}
