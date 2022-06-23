What are Import Maps?

[Import Maps](https://github.com/WICG/import-maps) allow web pages to control the behavior of JavaScript imports using the import() or System.import() APIs.

Why and how do I use Import Maps?
When you use import() or System.import() in a web page, the browser will load the script and execute it. However, by default, browsers can only load scripts with a full URL to where the script is located. This means if you use a statement like import('lodash') in your script, the browser will not know where to find the script. This is where import maps come in.

Import maps allow you to specify a mapping of a module name to a URL. This mapping is then used by the browser to load the script. 

Here's an example of how to use import maps:
```
<script type="import-map">
  {
    "imports": {
      "lodash": "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js"
    }
  }
</script>
  ```

With this import map, you can now use import('lodash') to load the lodash script and the browser will then load the script from the URL specified.

This means you don't need to manually specify the URL of the script you want to load in your code and can use the friendly name of the module instead.

We make use of import maps in the [SystemJS](https://github.com/systemjs/systemjs) within our runtime engine to allow us to load our modules for external urls to where the application is hosted. This could be from a CDN or from a remote server.
