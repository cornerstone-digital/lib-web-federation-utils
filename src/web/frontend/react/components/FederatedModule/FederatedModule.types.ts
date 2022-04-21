import { ReactElement } from 'react'

export type FederatedModulePropMap = Record<string, unknown>

export type FederatedModules<T extends FederatedModulePropMap> = T

export type FederatedMetaData = {
  scope: string
  name: string
  version: string
}

export type FederatedModuleType<PropsType> = FederatedMetaData & {
  props: PropsType
}

export type FederatedModuleProps<ModuleType extends FederatedModuleType<unknown>> = {
  module: Pick<ModuleType, 'scope' | 'name' | 'version'>
  props: ModuleType['props']
  stateComponents: {
    error?: () => ReactElement
  }
}
