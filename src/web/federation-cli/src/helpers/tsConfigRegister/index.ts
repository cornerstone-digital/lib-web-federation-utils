const tsConfigPaths = require('tsconfig-paths')
const fs = require('fs')
const tsConfigRegister = path => {
  if (!fs.existsSync(path)) throw new Error('path not defined')
  const { baseUrl, paths } = require(path).compilerOptions
  tsConfigPaths.register({
    baseUrl,
    paths: paths,
  })
}

export default tsConfigRegister
