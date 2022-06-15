import { CreateFederatedReactOptions } from '../../createFederatedReact.types'
import { ReactElement } from 'react'

const reactDomRender = <PropsType>(
  opts: CreateFederatedReactOptions<PropsType>,
  elementToRender: ReactElement,
  domElement: HTMLElement
) => {
  const renderType =
    typeof opts.renderType === 'function'
      ? opts.renderType()
      : opts.renderType || 'render'

  if (renderType === 'hydrate') {
    opts.ReactDOM.hydrate(elementToRender, domElement)
  } else {
    // default to this if 'renderType' is null or doesn't match the other options
    opts.ReactDOM.render(elementToRender, domElement)
  }

  return null
}

export default reactDomRender
