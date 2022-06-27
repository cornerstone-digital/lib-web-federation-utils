import { SharedImportMapConfig } from './createSharedImportMap.types'

const depMap = {
  react: {
    dev: 'react/17/umd/react.development.js',
    prod: 'react/17/umd/react.production.min.js',
  },

  reactDom: {
    dev: 'react-dom/17/umd/react-dom.development.js',
    prod: 'react-dom/17/umd/react-dom.production.min.js',
  },

  reactIs: {
    dev: 'react-is/17.0.2/umd/react-is.development.js',
    prod: 'react-is/17.0.2/umd/react-is.production.min.js',
  },

  styledComponents: {
    dev: 'styled-components/5.3.5/styled-components.js',
    prod: 'styled-components/5.3.5/styled-components.js',
  },
}

const createSharedImportMap = (config: SharedImportMapConfig) => {
  const imports: Record<string, string> = {}

  if (config.imports.addReact) {
    imports['react'] = `${config.basePath}/${
      config.isDev ? depMap.react.dev : depMap.react.prod
    }`
    imports['react-dom'] = `${config.basePath}/${
      config.isDev ? depMap.reactDom.dev : depMap.reactDom.prod
    }`
    imports['react-is'] = `${config.basePath}/${
      config.isDev ? depMap.reactIs.dev : depMap.reactIs.prod
    }`
  }

  if (config.imports.addStyledComponents) {
    imports['styled-components'] = `${config.basePath}/${
      config.isDev ? depMap.styledComponents.dev : depMap.styledComponents.prod
    }`
  }

  return { imports }
}

export default createSharedImportMap
