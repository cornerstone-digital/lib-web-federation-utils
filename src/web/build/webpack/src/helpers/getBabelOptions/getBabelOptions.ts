export type LoaderOptions = {
  enableCssModules?: boolean
  enableJsxControlStatements?: boolean
  aliases?: Record<string, string>
}

export type BabelConfig = {
  presets?: any[]
  plugins?: any[]
}

const getBabelOptions = (loaderOptions: LoaderOptions): BabelConfig => {
  const presets: any[] = [
    '@babel/preset-env',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
    '@babel/preset-typescript',
  ]

  const plugins: any[] = [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-regenerator',
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
      },
    ],
    'add-react-displayname',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: false,
        regenerator: true,
        useESModules: true,
      },
    ],
    [
      'module-resolver',
      {
        alias: loaderOptions.aliases,
        root: ['./'],
      },
    ],
  ]

  if (loaderOptions.enableCssModules) {
    plugins.push([
      'react-css-modules',
      {
        filetypes: {
          '.scss': {
            plugins: ['postcss-nested'],
            syntax: 'postcss-scss',
          },
        },
        generateScopedName: 'vfuk-[name]__[local]',
        webpackHotModuleReloading: true,
      },
    ])
  }

  if (loaderOptions.enableJsxControlStatements) {
    plugins.push('jsx-control-statements')
  }

  return {
    plugins,
    presets,
  }
}

export default getBabelOptions
