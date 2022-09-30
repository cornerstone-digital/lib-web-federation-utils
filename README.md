<div align="center">
  <img src='https://cdn3.iconfinder.com/data/icons/digital-marketing-3-9/35/126-1024.png' width="300"></img>
  <h2 style="font-size:40px;font-weight:bold">Federation Utils</h2>
  <h2 style="color:#e60000;font-size:30px;font-weight:bold">Vodafone Micro Frontend Solutions</h2>
</div>

# Introduction

lib-web-federation-utils is a collection of helpers function and build tools that construct the frame work for micro frontend architecture within web applications for Vodafone

# Getting started

## Installation process

Dev Dependencies

`yarn add @vf/federated-web-build-core @vf/federated-web-build-types @vf/federated-web-build-webpack --dev`

Dependencies

`yarn add @vf/federated-web-frontend-react`

# Build tools (built MFE)

## Webpack build

use `import { compileFederatedModules } from '@vf/federated-web-build-webpack/dist/helpers'`

`compileFederatedModules` Takes 1 parameter [options]

```
const options = {

  Points at the directory where your micro components are located that you want compiled as micro components.
  federatedModuleDir: path.resolve(process.cwd(), 'micro-component'),


  Points at the assest folder of your main apps build folder, would normally output to a sub folder micro-components.
  buildDir: path.resolve(process.cwd(), 'build/assets/micro-components'),


  Public path to micro components (should follow the same convention of the main application)
  basePath: '/broadband/deals/assets/micro-components',


  Sets env
  isDev: settings.isDev,


  Passes in your webpack client config to in ensure all requires rules and dependancies are part of the micro components build.
  webpackConfig: clientConfig,


  Passes in any required Environment variables to the DefinePlugin class within the build config
  defineEnv: {
    CORE_WS2_ASSETS: JSON.stringify('/broadband/deals/assets/ws2'),
    CORE_FONT_PREFIX: JSON.stringify('/broadband/deals/assets/ws10'),
    CORE_WS10_ASSETS: JSON.stringify('/broadband/deals/assets/ws10'),
    WEBPACK_ASSET_PREFIX: JSON.stringify('/broadband/deals'),
  }

};

compileFederatedModules(options)

```

This will build the micro components to the required folders within your build folder.

## Vite build (Coming soon)

## App configurations

All micro components will be built and exported as SystemJS modules. Your web application bundle will need to be a SystemJS bundle when it is built to be able to support the micro component architecture. This is so that your app and the micro component can use the same shared modules like `react` and `react-dom`.

```
Application webpack config example:

const clientConfig: Configuration = {

  mode: settings.isDev ? 'development' : 'production',

  entry: {
    acquisitionsMain: resolve(process.cwd(), 'src/index'),
    upgradesMain: resolve(process.cwd(), 'src/upgradesIndex.js'),
  },

  output: {
    libraryTarget: 'system',  <--- Export as a SystemJS module
  },

  externals: {
    Set the shared modules in the externals
    react: 'react',
    'react-dom': 'react-dom',
  },
}
```

The app will need to consume react and react-dom from the cdn that are provided by SystemJS import maps. These import map are added as links to your index.html. web-shop-broadband houses the cdn bundles within their local build so that it servers the umd from its node server, SystemJS will also need to be added as script tags on the index.html file as well. (This will be replaced with CDN links soon, check example below...)

```
  <head>
    <meta charset='utf-8' />
    <meta http-equiv='X-UA-Compatible' content='IE=edge' />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <meta name='mobile-web-app-capable' content='yes' />
    <link rel='icon' type='image/x-icon' href='/favicon.ico' />
    ${analytics || ''}
    <meta name="importmap-type" content="systemjs-importmap">
    <script crossorigin="anonymous" type="systemjs-importmap" src="/broadband/deals/assets/micro-components/import-maps/shared.json"></script>
    <script crossorigin="anonymous" type="systemjs-importmap" src="/broadband/deals/assets/micro-components/import-maps/broadband-imports.json"></script>
    <script crossorigin="anonymous" type="systemjs-importmap" src="/broadband/deals/assets/entries-import-map.json"></script>
    <script crossorigin="anonymous" src="/broadband/deals/assets/shared-modules/systemjs@6.7.1/dist/system.min.js" data-cookieconsent="ignore"></script>
    <script crossorigin="anonymous" src="/broadband/deals/assets/shared-modules/systemjs@6.7.1/dist/named-exports.min.js" data-cookieconsent="ignore"></script>
    <script>
      System.import('${loadAppManifestPath}')
    </script>
  </head>
```

`System.import('${loadAppManifestPath}')` Should have the file path to your main bundle file as this will run the your main app as normal. (A normal webpack build is self invoking, as the build is now a `system` build. It will need to be called with the System.import method)

A new property `'@vfuk/basePaths'` is applied to the window variable VFUK object. It houses the public path to micro components from different web applications which the react `<FederatedComponent />` will consume:

```
  var VFUK = {
    env: {
      ASSET_URL: '${assetUrl}',
    },
    '@vfuk/basePaths': {
      broadband: '${broadbandBasePath}'
    }
  };
```

## Consuming micro component in app

Use `import FederatedModule from '@vf/federated-web-frontend-react/components/FederatedModule'`

`FederatedModule` Is a react lazy component that should be used within `Suspense`.

```
<Suspense fallback='loading'>
  <FederatedModule
    module={{
      References the name of the component which needs to be imported from the micro component
      name: 'AvailabilityChecker',
    }}

    Props past to the component
    props={{
      journeyResponse: LandingPageStore.links,
      segment: LandingPageStore.segment,
      pageType: this.props.pageType,
    }}

    Component passed in to show the error state if the component is unable to load.
    stateComponents={{
      error: () => <div>Error</div>
    }}
  />
</Suspense>
```

# Contribute

For support on implementation and design approach into your application contact:

Martin Egan

Kiran Earle

Christophe Lamarliere
