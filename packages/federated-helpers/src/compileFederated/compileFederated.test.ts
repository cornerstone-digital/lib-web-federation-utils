/*
 * @jest-environment node
 */

import compileFederated, {
  CompileFederatedModulesOptions,
} from './compileFederated'
import * as fs from 'fs-extra'
import * as vite from 'vite'
import { resolve } from 'path'

const basePath = '/path/to/base'
const federatedFolder = resolve(__dirname, 'federated')
const distFolder = resolve(__dirname, 'dist')
const buildFolder = resolve(__dirname, 'build')
const hash = 'l8a6h1zm'

describe('compileFederated', () => {
  beforeEach(() => {
    jest.restoreAllMocks()

    // create dist folder if it doesn't exist
    if (!fs.existsSync(distFolder)) {
      fs.mkdirSync(distFolder)
    }
  })

  it('should compile the federated modules', async () => {
    const viteOptions: CompileFederatedModulesOptions['viteOptions'] = {
      plugins: [],
      define: {},
      build: {},
    }

    await compileFederated({
      vite,
      viteOptions,
      basePath,
      federatedFolder,
      distFolder,
      buildFolder,
      hash,
    })

    const mockImports = {
      'vfuk-component1': `/path/to/base/federated/components/component1/component1-${hash}.umd.js`,
      'vfuk-component2': `/path/to/base/federated/components/component2/component2-${hash}.umd.js`,
      react:
        '/path/to/base/federated/shared/react/17.0.2/umd/react.production.min.js',
      'react-dom':
        '/path/to/base/federated/shared/react-dom/17.0.2/umd/react-dom.production.min.js',
      'react-is':
        '/path/to/base/federated/shared/react-is/17.0.2/umd/react-is.production.min.js',
      'styled-components':
        '/path/to/base/federated/shared/styled-components/5.3.5/umd/styled-components.js',
    }

    const importMapPath = `${distFolder}/entries-import-map.json`

    expect(fs.readFileSync(importMapPath, 'utf8')).toEqual(
      JSON.stringify({ imports: mockImports }, null, 2)
    )
  })

  it('should compile the federated modules with a custom import prefix', async () => {
    const viteOptions = {
      plugins: [],
      define: {},
      build: {},
    }

    const importPrefix = 'vfde'

    await compileFederated({
      vite,
      viteOptions,
      basePath,
      federatedFolder,
      distFolder,
      buildFolder,
      importPrefix,
      hash,
    })

    const mockImports = {
      'vfde-component1': `/path/to/base/federated/components/component1/component1-${hash}.umd.js`,
      'vfde-component2': `/path/to/base/federated/components/component2/component2-${hash}.umd.js`,
      react:
        '/path/to/base/federated/shared/react/17.0.2/umd/react.production.min.js',
      'react-dom':
        '/path/to/base/federated/shared/react-dom/17.0.2/umd/react-dom.production.min.js',
      'react-is':
        '/path/to/base/federated/shared/react-is/17.0.2/umd/react-is.production.min.js',
      'styled-components':
        '/path/to/base/federated/shared/styled-components/5.3.5/umd/styled-components.js',
    }

    const importMapPath = `${distFolder}/entries-import-map.json`

    expect(fs.readFileSync(importMapPath, 'utf8')).toEqual(
      JSON.stringify({ imports: mockImports }, null, 2)
    )
  })

  it('should call console.error if there is an error', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementationOnce(() => null)
    // Force JSON.stringify to throw an error
    jest.spyOn(JSON, 'stringify').mockImplementationOnce(() => {
      throw new Error('Test error')
    })

    const viteOptions = {
      plugins: [],
      define: {},
      build: {},
    }

    await compileFederated({
      vite,
      viteOptions,
      basePath,
      federatedFolder,
      distFolder,
      buildFolder,
    })

    expect(consoleSpy).toHaveBeenCalled()
  })
})
