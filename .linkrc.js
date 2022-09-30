module.exports = {
  compiler: 'lerna',
  lerna: {
    packages:
      'packages/+(federated-core|federated-react|federated-helpers)/**/',
    enableTempPathCompile: false,
    enableCwdCompile: true,
    enablePackagePath: false,
    enableSelfLink: false,
    enableSelfLinkNoEmmit: false,
    copyExtra: ['package.json'],
  },
  yarnInstall: false,
  enableSourceCleanup: false,
  enableTargetCleanup: false,
  compileYarnCmd: 'build',
  keepOutputDirNameWhenLink: false,
  // whitelist list of the projects that can be linked to
  // by defining a whitelisted prefixes eg
  // - ['lib-', 'web-']
  parentProjectsPrefixWhitelist: [
    'template-web',
    'web-ecare',
    'web-shop-',
    'web-voxi-',
  ],
  // copy extra files
  // this is ROOT level
  // Only files are supported, no * or folders
  // keepOutputDirNameWhenLink won't be applied for this as well
  // eg
  // - 'package.json' will copy a package json from root/package.json
  // copyExtra: [
  //   'package.json',
  // ],
  nodemonWatch: {
    ext: 'js json ts jsx tsx',
    watch: ['./packages'],
    ignore: ['lib/*', 'node_modules/*', 'dist/*', 'bin/*'],
    script: '.linkrc.js',
  },
}
