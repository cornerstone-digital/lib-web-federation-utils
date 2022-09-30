import React, { ComponentType } from 'react'
import ReactDOM from 'react-dom'
import { render } from '@testing-library/react'

import createErrorBoundary from './createErrorBoundary'
import { initFederatedRuntime } from '@vf/federated-core'

let consoleErrorMock: jest.SpyInstance

describe('createErrorBoundary', () => {
  beforeEach(() => {
    consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
  })

  afterEach(() => {
    consoleErrorMock.mockRestore()
  })

  it('should return a function', () => {
    expect(createErrorBoundary).toBeInstanceOf(Function)
  })

  it('should return an error boundary component', () => {
    const ErrorBoundary = createErrorBoundary({
      React,
      ReactDOM,
      config: {
        type: 'journey-module',
        name: 'test',
      },
      enableSystemJs: true,
      federatedRuntime: initFederatedRuntime(),
    })

    expect(ErrorBoundary).toBeInstanceOf(Function)
  })

  it('should return an error boundary component with default error boundary', () => {
    const ErrorBoundary: ComponentType = createErrorBoundary({
      React,
      ReactDOM,
      config: {
        type: 'journey-module',
        name: 'test',
      },
      enableSystemJs: true,
      federatedRuntime: initFederatedRuntime(),
    })

    const ErroredComponent = () => {
      throw new Error('💥 CABOOM 💥')
    }

    const Component = () => {
      return (
        // @ts-ignore
        <ErrorBoundary>
          <ErroredComponent />
        </ErrorBoundary>
      )
    }

    const { getByText } = render(<Component />)

    expect(getByText('Something went wrong')).toBeInTheDocument()
    expect(getByText('💥 CABOOM 💥')).toBeInTheDocument()
  })

  it('should return an error boundary component with custom error boundary', () => {
    const ErrorBoundary: React.FC = createErrorBoundary({
      React,
      ReactDOM,
      config: {
        type: 'journey-module',
        name: 'test',
        errorBoundary: (error) => {
          return (
            <div>
              <h1>Oops! That didn&apos;t go as expected!</h1>
              <p>{error.message}</p>
            </div>
          )
        },
      },
      enableSystemJs: true,
      federatedRuntime: initFederatedRuntime(),
    })

    const ErroredComponent = () => {
      throw new Error('💥 CABOOM 💥')
    }

    const Component = () => {
      if (!ErrorBoundary) return null

      return (
        // @ts-ignore
        <ErrorBoundary>
          <ErroredComponent />
        </ErrorBoundary>
      )
    }

    const { getByText } = render(<Component />)

    expect(getByText("Oops! That didn't go as expected!")).toBeInTheDocument()
    expect(getByText('💥 CABOOM 💥')).toBeInTheDocument()
  })
})
