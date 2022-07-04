import React from 'react'
import { FederatedModuleLoader } from '@vf/federated-react'
import bannerData from '../data/banner-mock'
import headerData from '../data/header-mock.json'

const AppComponent = () => {
  return (
    <>
      <FederatedModuleLoader
        scope="vfuk-federated-component-example"
        name="FederatedStandardBanner"
        props={{
          bannerData,
        }}
      />
      <FederatedModuleLoader
        scope="vfuk-federated-component-example"
        name="FederatedCard"
        props={{
          headerData,
        }}
      />
    </>
  )
}

export default AppComponent
