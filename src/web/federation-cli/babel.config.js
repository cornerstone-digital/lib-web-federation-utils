module.exports = api => {
  api.cache(true)

  const presets = ['@babel/preset-typescript', '@babel/preset-env', '@babel/preset-react']
  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3,
        regenerator: true,
      },
    ],
  ]

  return {
    plugins,
    presets,
  }
}
