import createSharedImportMap, { getImportUrl } from './createSharedImportMap'

describe('createSharedImportMap', () => {
  it('should return import map with prod when isDev false', () => {
    const importMap = createSharedImportMap({
      imports: {
        addVue: true,
        addReact: true,
        addStyledComponents: true,
      },
      format: 'umd',
      isDev: false,
      basePath: 'http://cdn.vodadone.co.uk/shared-assets',
    })

    expect(importMap).toMatchSnapshot()
  })

  it('should return import map with dev when isDev true', () => {
    const importMap = createSharedImportMap({
      imports: {
        addVue: true,
        addReact: true,
        addStyledComponents: true,
      },
      format: 'umd',
      isDev: true,
      basePath: 'http://cdn.vodadone.co.uk/shared-assets',
    })

    expect(importMap).toMatchSnapshot()
  })

  describe('getImportUrl', () => {
    it('should return url with basePath', () => {
      const url = getImportUrl(
        'react/17.0.2/umd/react.production.min.js',
        'http://cdn.vodadone.co.uk/shared-assets'
      )
      expect(url).toBe(
        'http://cdn.vodadone.co.uk/shared-assets/react/17.0.2/umd/react.production.min.js'
      )
    })

    it('should not add basePath when url starts with http', () => {
      const url = getImportUrl(
        'http://some-other-url/react/17.0.2/umd/react.production.min.js',
        'http://cdn.vodadone.co.uk/shared-assets'
      )
      expect(url).toBe(
        'http://some-other-url/react/17.0.2/umd/react.production.min.js'
      )
    })
  })
})
