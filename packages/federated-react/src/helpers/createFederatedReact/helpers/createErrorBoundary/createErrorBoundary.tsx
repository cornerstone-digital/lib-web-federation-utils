import React, { ErrorInfo, PropsWithChildren } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { CreateFederatedReactOptions } from '../../createFederatedReact.types'
import { stringUtils } from '@vf/federated-core'

type ErrorBoundaryState = {
  hasError: boolean
  caughtError: Error | null
  caughtErrorInfo: ErrorInfo | null
}

// @ts-ignore
function createErrorBoundary<PropTypes>(
  opts: CreateFederatedReactOptions<PropTypes>
): any {
  const WithErrorBoundary = (props: PropsWithChildren<PropTypes>) => {
    return (
      <ErrorBoundary
        fallbackRender={({ error }) => {
          if (opts.config.errorBoundary) {
            return opts.config.errorBoundary(error)
          }

          return (
            <div>
              <h1>Something went wrong</h1>
              <p>{error.message}</p>
            </div>
          )
        }}
      >
        {props.children}
      </ErrorBoundary>
    )
  }

  WithErrorBoundary.displayName = `WithErrorBoundary${stringUtils.pascalise(
    opts.config.name
  )}`

  return WithErrorBoundary
}

export default createErrorBoundary
