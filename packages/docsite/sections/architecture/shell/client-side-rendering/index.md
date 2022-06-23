# Client-Side Rendering (CSR) - Using the Core Runtime

Client-Side Rendering (CSR) is a technique for rendering a web application client-side without the need for a round-trip to the server.

Client-Side Routing is not a new concept, and frontend frameworks like React and Vue have already support it using the Router component.

However, when you are building a [Federated Application](), the way your render the application is very different.

Instead of using something like React Router the [Federated Runtime Engine]() will be responsible for rendering the application client-side using its own [routing engine]().

Below is a diagram of how the [Federated Runtime Engine]() will render the application client-side:

![Client-Side Rendering](../../../assets/images/client-side-rendering.png)
