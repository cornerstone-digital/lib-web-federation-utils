# Client-Side Rendering (CSR) - How it works

When building a [Federated Application](/sections/architecture/federated-applications/index.md) the [Federated Entry Point](/sections/architecture/federated-applications/federated-entry-points.md) is responsible for instantiating the [Federated Runtime Engine](/sections/architecture/federated-applications/federated-runtime-engine.md) and registering any [Federated Journey's](/sections/architecture/federated-journeys/index.md) and for starting the application.

When the application is started, the [Federated Runtime Engine](/sections/architecture/federated-applications/federated-runtime-engine.md) will bootstrap the [Federated Journey's](/sections/architecture/federated-journeys/index.md) and the [Federated Application Routing Engine](/sections/architecture/federated-applications/federated-routing-engine.md) will orchestrate the loading and mounting of the application components based on the URL currently being visited.

The [Federated Entry Point](/sections/architecture/federated-applications/federated-entry-points.md) is not written with any specific framework or library, but instead is written as a standard JavaScript file.

An example of which can be seen in our [Creating your Federated Entry Point](/sections/getting-started/configuring-your-app/creating-your-federated-entry-point.md) section.
