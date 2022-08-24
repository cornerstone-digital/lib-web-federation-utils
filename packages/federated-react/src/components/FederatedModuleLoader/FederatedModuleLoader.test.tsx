import React from 'react'
import ReactDOM from 'react-dom'
import FederatedModuleLoader from './FederatedModuleLoader'
import { render, waitFor } from '@testing-library/react'
import {
  FederatedEvents,
  FederatedModule,
  initFederatedRuntime,
} from '@vf/federated-core'

const TestComponent = () => {
  return <h1>Test Component</h1>
}

const elementId = 'test-element'

const handleModuleMount = jest.fn(() => {
  ReactDOM.render(<TestComponent />, document.getElementById(elementId))
})
const handleModuleUnmount = jest.fn(() => {
  const element = document.getElementById(elementId)
  if (element) {
    ReactDOM.unmountComponentAtNode(element)
  }
})

const testModule: FederatedModule = {
  scope: 'test',
  name: 'module-1',
  type: 'component',
  mount: async (_props, _mountId) => handleModuleMount(),
  unmount: async () => handleModuleUnmount(),
  update: jest.fn(),
}

describe('FederatedModuleLoader', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    const federatedRuntime = initFederatedRuntime()

    federatedRuntime.registerModule(testModule)

    window.__FEDERATED_CORE__ = {
      federatedRuntime,
    }
  })

  it('should mount without crashing', () => {
    const { container } = render(
      <FederatedModuleLoader
        scope="test"
        name="module-1"
        props={{}}
        mountId={elementId}
      />
    )

    expect(container).toBeDefined()
  })

  it('should unmount without crashing', () => {
    const { container } = render(
      <FederatedModuleLoader
        scope="test"
        name="module-1"
        props={{}}
        mountId={elementId}
      />
    )

    expect(container).toBeDefined()

    container.remove()
  })

  it('should mount a div with id matching passed mountId', () => {
    const { container } = render(
      <FederatedModuleLoader
        scope="test"
        name="module-1"
        props={{}}
        mountId={elementId}
      />
    )

    expect(container.querySelector(`div[id^="${elementId}"]`)).not.toBeNull()
  })

  it('should set a default mountId if none is passed', () => {
    const { container } = render(
      <FederatedModuleLoader scope="test" name="module-1" props={{}} />
    )

    expect(container.querySelector(`div[id^="test-module-1-"]`)).not.toBeNull()
  })

  it('should call mount on module', () => {
    const reactRenderSpy = jest.spyOn(ReactDOM, 'render')
    const mountSpy = jest.spyOn(testModule, 'mount')

    render(
      <FederatedModuleLoader
        scope="test"
        name="module-1"
        props={{}}
        mountId={elementId}
      />
    )

    waitFor(() => {
      expect(mountSpy).toHaveBeenCalled()
      expect(reactRenderSpy).toHaveBeenCalled()
    })
  })

  it('should call unmount on module', () => {
    const federatedRuntime = initFederatedRuntime()
    const reactUnmountSpy = jest.spyOn(ReactDOM, 'unmountComponentAtNode')
    const { unmount } = render(
      <FederatedModuleLoader
        scope="test"
        name="module-1"
        props={{}}
        mountId={elementId}
      />
    )

    federatedRuntime?.services.event.register(
      FederatedEvents.MODULE_MOUNTED,
      () => {
        unmount()
        expect(handleModuleUnmount).toHaveBeenCalled()
        expect(reactUnmountSpy).toHaveBeenCalled()
      },
      { scope: 'test', name: 'module-1' }
    )
  })
})
