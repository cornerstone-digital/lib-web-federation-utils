import React from 'react'
import { FederatedModuleLoader } from '@vf/federated-react'
import bannerData from '../data/banner-mock'
import headerData from '../data/header-mock.json'

const AppComponent = () => {
  return (
    <>
      <FederatedModuleLoader
        name="vfuk-federated-component-example"
        props={{
          bannerData,
        }}
      />
      <FederatedModuleLoader
        name="vfuk-federated-component-example"
        props={{
          headerData,
        }}
      />
    </>
  )
}

export default AppComponent
