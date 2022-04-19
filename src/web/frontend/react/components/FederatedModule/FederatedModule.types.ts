import { ReactElement } from 'react'

export type FederatedModuleType = {
  scope: string
  name: string
  version: string
}

export type FederatedModuleProps<T> = {
  module: FederatedModuleType
  props: T
  stateComponents: {
    error: () => ReactElement
  }
}