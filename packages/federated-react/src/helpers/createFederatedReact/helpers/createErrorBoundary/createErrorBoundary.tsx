import React, { PropsWithChildren, ReactElement } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { CreateFederatedReactOptions } from '../../createFederatedReact.types'
import { stringUtils } from '@vf/federated-core'

// @ts-ignore
function createErrorBoundary<PropTypes>(
  opts: CreateFederatedReactOptions<PropTypes>
): {
  (props: PropsWithChildren<PropTypes>): ReactElement<unknown>
  displayName: string
} {
  const WithErrorBoundary = (props: PropsWithChildren<PropTypes>) => {
    return (
      // @ts-ignore
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
