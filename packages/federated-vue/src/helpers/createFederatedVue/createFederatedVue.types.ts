import * as Vue from 'vue'
import { Component } from 'vue'
import {
  FederatedModuleTypes,
  FederatedModuleBaseOptions,
  FederatedModuleLifecycles,
  AbstractFederatedRuntime,
  FederatedRuntime,
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
    domElementId?: string
    rootComponent?: Component<RootComponentProps>
    errorBoundary?: Component<unknown>
    defaultProps?: RootComponentProps
    propValidationFunction?: ValidateFunction<RootComponentProps>
    activeWhenPaths?: string[]
    exceptWhenPaths?: string[]
  }
  Vue: typeof Vue
  federatedRuntime: AbstractFederatedRuntime | FederatedRuntime
}
export type FederatedVueApp<PropsType> = FederatedModuleBaseOptions<PropsType> &
  FederatedModuleLifecycles<PropsType> & {
    domElementId: CreateFederatedVueOptions<PropsType>['config']['domElementId']
  }
