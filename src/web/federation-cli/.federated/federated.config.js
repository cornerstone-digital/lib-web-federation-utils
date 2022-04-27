const { resolve } = require("path");
const federatedApps = {
  TestComponent: {
    name: "Availability Checker",
    description: "Check if a broadband deal is available in your area",
    entryFile: resolve(process.cwd(), "./src/federated-components/TestComponent/index.tsx"),
    port: 8001,
    buildTool: "webpack",
    htmlFile: resolve(process.cwd(), "./src/federated-components/TestComponent/index.html"),
    defineEnv: {},
    compilerConfig: {}
  }
};
const config = {
  publicPath: "/test/public/path",
  buildFolder: resolve(process.cwd(), "build"),
  federatedApps
};
module.exports = config;
