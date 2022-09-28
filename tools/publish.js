const path = require('path')
const fs = require('fs')

const copyNpmrcToPackage = (packageDir) => {
  const npmrcPath = path.join(process.cwd(), '.npmrc')

  if (fs.existsSync(npmrcPath)) {
    fs.copyFileSync(npmrcPath, path.join(packageDir, '.npmrc'))
  }
}

// Loop through all the packages in {root}/dist/packages and npm publish them
const publishPackages = () => {
  const root = path.join(process.cwd(), 'dist', 'packages')

  fs.readdirSync(root).forEach((packageName) => {
    const packageDir = path.join(root, packageName)
    const packageJson = require(path.join(packageDir, 'package.json'))
    let channel = 'latest'

    if (packageJson.private) {
      return
    }

    copyNpmrcToPackage(packageDir)

    console.log(
      `Publishing ${packageName}@${packageJson.version} to --tag=${channel}`
    )
    require('child_process').execSync(
      `npm publish ${packageDir} --tag ${channel}`
    )
  })
}

publishPackages()
