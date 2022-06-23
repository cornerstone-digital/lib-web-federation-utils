# What is SystemJS?
[SystemJS](https://github.com/systemjs/systemjs) is a module loader that can import modules at run time in any of the popular formats used today (CommonJS, UMD, AMD, ES6). 

It is built on top of the [ES6 module loader polyfill](https://github.com/ModuleLoader/es6-module-loader) and is smart enough to detect the format being used and handle it appropriately. 

SystemJS also has several extra add-ons to support the use of AMD, CommonJS, and ES6 modules among other file formats.

These add-ons are:
- [AMD Extra](https://github.com/systemjs/systemjs/blob/main/dist/extras/amd.js)
  to support loading of AMD modules (through Window.define which is created).
- [Named Register](https://github.com/systemjs/systemjs/blob/main/dist/extras/named-register.js)
  to add support for System.register('name', ...) named bundles which can then be imported as System.import('name') (as well as AMD named define support)
- [Dynamic Import Maps](https://github.com/systemjs/systemjs/blob/main/dist/extras/dynamic-import-maps.js)
Adds support for dynamic import maps. This is currently a potential new [standard feature](https://github.com/guybedford/import-maps-extensions#lazy-loading-of-import-maps).
- [Global Loading](https://github.com/systemjs/systemjs/blob/main/dist/extras/global.js)
Adds support for loading global scripts and detecting the defined global as the default export. Useful for loading common library scripts from CDN like System.import('//unpkg.com/lodash').
- [Module Types](https://github.com/systemjs/systemjs/blob/main/dist/extras/module-types.js)
Adds .css, .wasm, .json module type loading support in line with the existing modules specifications.
