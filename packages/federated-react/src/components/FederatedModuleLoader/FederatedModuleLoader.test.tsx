import ReactDOM from 'react-dom'
import FederatedModuleLoader from './FederatedModuleLoader'
import { render } from '@testing-library/react'
import {
  FederatedEvents,
  FederatedRuntime,
  getFederatedRuntime,
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

jest.mock('../../hooks', () => ({
  useFederatedModule: () => {
    return {
      scope: 'test',
      name: 'module-1',
      mount: handleModuleMount,
      unmount: handleModuleUnmount,
    }
  },
}))

describe('FederatedModuleLoader', () => {
  beforeEach(() => {
    jest.resetAllMocks()

    window.__FEDERATED_CORE__ = {
      moduleBaseUrls: {},
      federatedRuntime: new FederatedRuntime(),
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
    render(
      <FederatedModuleLoader
        scope="test"
        name="module-1"
        props={{}}
        mountId={elementId}
      />
    )

    expect(handleModuleMount).toHaveBeenCalled()
    expect(reactRenderSpy).toHaveBeenCalled()
  })

  it('should call unmount on module', () => {
    const federatedRuntime = getFederatedRuntime()
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
