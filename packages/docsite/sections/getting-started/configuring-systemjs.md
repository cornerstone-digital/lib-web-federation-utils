# Configuring SystemJS

In order to be able to use SystemJS as a module loader within your application, there a few things you will need to do.

## 1. Copy SystemJS javascript files to your build's asset folder
In order for your application to load SystemJS, until they are available by a shared VF owned CDN, you need to make sure your application is configured to serve the required files.

See [Configuring Webpack](/sections/getting-started/configuring-webpack) for an example of how to do this with webpack.
## 2. Add SystemJS to your index.html file

```html
<html>
   <head>
     <-- Head content here -->
   </head>
   <body>
     <-- Body content here -->

     <!-- SystemJS -->
     <script
       src="%appBasePath%/assets/federated/shared-modules/import-map-overrides/3.0.0/import-map-overrides.min.js"
       crossorigin="anonymous"
       referrerpolicy="no-referrer"
     ></script>
     <script
       id="systemjs"
       src="%appBasePath%/assets/federated/shared-modules/systemjs/6.12.1/system.min.js"
       crossorigin="anonymous"
       referrerpolicy="no-referrer"
     ></script>
     <script
       id="systemjs-named-exports"
       src="%appBasePath%/assets/federated/shared-modules/systemjs/6.12.1/extras/named-exports.min.js"
       crossorigin="anonymous"
       referrerpolicy="no-referrer"
     ></script>
     <script
       id="systemjs-amd"
       src="%appBasePath%/assets/federated/shared-modules/systemjs/6.12.1/extras/amd.min.js"
       crossorigin="anonymous"
       referrerpolicy="no-referrer"
     ></script>
     <script
       id="systemjs-dynamic-import-maps"
       src="%appBasePath%/assets/federated/shared-modules/systemjs/6.12.1/extras/dynamic-import-maps.min.js"
       crossorigin="anonymous"
       referrerpolicy="no-referrer"
     ></script>
   </body>
</html>
```
