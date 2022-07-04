import { SharedImportMapConfig } from './createSharedImportMap.types'

const getDepMap = (format: 'umd' | 'esm') => ({
  vue: {
    dev: `vue/3.2.25/vue.global.prod.min.js`,
    prod: `vue/3.2.25/vue.global.prod.min.js`,
  },
  react: {
    dev: `react/17.0.2/${format}/react.production.min.js`,
    prod: `react/17.0.2/${format}/react.production.min.js`,
  },

  reactDom: {
    dev: `react-dom/17.0.2/${format}/react-dom.production.min.js`,
    prod: `react-dom/17.0.2/${format}/react-dom.production.min.js`,
  },

  reactIs: {
    dev: `react-is/17.0.2/${format}/react-is.production.min.js`,
    prod: `react-is/17.0.2/${format}/react-is.production.min.js`,
  },

  styledComponents: {
    dev: `styled-components/5.3.5/styled-components.min.js`,
    prod: `styled-components/5.3.5/styled-components.min.js`,
  },
})

export const getImportUrl = (url: string, baseUrl: string) => {
  if (url.startsWith('http')) {
    return url
  }

  return `${baseUrl}/${url}`
}

const createSharedImportMap = (
  config: SharedImportMapConfig,
  imports: Record<string, string> = {}
) => {
  const depMap = getDepMap(config.format)

  if (config.imports.addVue) {
    imports['vue'] = getImportUrl(
      config.isDev ? depMap.vue.dev : depMap.vue.prod,
      config.basePath
    )
  }
  if (config.imports.addReact) {
    imports['react'] = getImportUrl(
      config.isDev ? depMap.react.dev : depMap.react.prod,
      config.basePath
    )
    imports['react-dom'] = getImportUrl(
      config.isDev ? depMap.reactDom.dev : depMap.reactDom.prod,
      config.basePath
    )
    imports['react-is'] = getImportUrl(
      config.isDev ? depMap.reactIs.dev : depMap.reactIs.prod,
      config.basePath
    )
  }

  if (config.imports.addStyledComponents) {
    imports['styled-components'] = getImportUrl(
      config.isDev ? depMap.styledComponents.dev : depMap.styledComponents.prod,
      config.basePath
    )
  }

  return imports
}

export default createSharedImportMap
