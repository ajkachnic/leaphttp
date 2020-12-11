# leaphttp

> leaphttp is a powerful, light micro-http framework, with a focus on an extendable plugin interface, and a great developer experience

## Getting started

You can install leaphttp with your package manager of choice like so:

```sh
# For npm
npm i leaphttp
# For yarn
yarn add leaphttp
# For pnpm
pnpm i leaphttp
```

After installing, you can set up a simple hello world app in javascript like this:

```js
const { server } = require('leaphttp')

const app = server({
  port: 3000
})

app.route('/', {
  get: () => 'hello world!'
})

app.mount()
console.log(`Running on port ${app.port}`)
```

## The API

### `server` function

The server function takes an object as an arguement, with the following options and their default values (if provided):

```js
{
  port: 0, // A numeric value for the port of the server,
  host: 'localhost', // A string value for the host of the server. Use '0.0.0.0' for port forwarding,
  protocol: 'http', // A string for the protocol, either http or https. Doesn't really do much at the moment
  plugins: [] // An array of the plugins, more on this later
}
```

After you call the server function, you get an instance of the `Server` class, which can be used to create new routes and start the server

### Routing

You can create new routes with the `app.route` function. The first arguement of this function is the path/pattern that you want it to match, and the second is a routes object. A routes object looks something like this:

```js
{
  get: () => 'inline handlers',
  post: {
    handler: () => {
      return 'or use the handler property'
    },
    plugins: [] // Look! Route specific plugins
  }
}
```

Internally, leaphttp uses [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) to check if a path matches the pattern. You can read their documentation for more info on routing.

### Context

The `ctx` object is where all of the reference data is stored for each http request. Things like headers, the parameters, and even the raw Request and Response objects are available with the context object

Here is the basic schema for it:

```js
{
  method,   // The HTTP method
  headers,  // The Headers object (readonly)
  path,     // The relative path of the request
  params,   // The parameters found in the urlm like :this (different from search params)
  payload,  // A generic object that can be used by body parsers
  query,    // The search params, like ?foo=bar
  raw: {
    request,// The raw http request object, created by the node http package
    response// The raw http response object, created by the node http package
  }
};
```

### The helper (`h`)

For operations that affect the http response, you can use the `h` parameter. It can do things like setting response headers, setting the status, and converting objects to a string. It has the following methods:

```js
setHeader(name, value) // self-explanitory
status(statusCode) // sets the status
type(fileExtension) // sets the content-type field (only supports the most common mime types)
json(object) // converts an object to string and sets the content type
```

### Plugin API

You can create a plugin and hook into lifecycle events for the request. Here's an example of a plugin that post-processes pug:

```js
const { Plugin } = require('leaphttp')
const pug = require('pug')
class Pug extends Plugin {
  onPreResponse(ctx, h, resp) {
    h.type('html')
    return pug.render(resp)
  }
}
```

The current lifecycle hooks are:
- `onPreResponse`: called after the main handler and passed it's output as another arguement
- `onRequest`: called after the correct path is found, but before the main handler is called