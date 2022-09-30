import { FederatedModuleLoader } from '@vf/federated-react'
import bannerData from '../data/banner-mock'

const AppComponent = () => {
  return (
    <>
      <h3 style={{ textAlign: 'center', padding: 20 }}>
        Consuming Federated Component
      </h3>
      <FederatedModuleLoader
        name="vfuk-federated-component-example"
        props={{
          bannerData,
        }}
      />
    </>
  )
}

export default AppComponent
