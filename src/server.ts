import { Context, Helper } from 'helpers';
import http from 'http'
import { Plugin } from 'plugin'
import { RouteOptions, Router } from 'router'

export type ServiceOptions = {
  port: number,
  host?: string,
  protocol?: 'http' | 'https'
  plugins?: []
}
export class Server {
  port: number;
  host: string;
  protocol?: 'http' | 'https'
  private plugins: Plugin[];
  private router = new Router();


  constructor(opts: ServiceOptions) {
    this.port = opts.port;
    this.host = opts.host ?? 'localhost';
    this.protocol = opts.protocol || 'http';
    this.plugins = opts.plugins || []
  }

  route(path: string, opts: RouteOptions) {
    Object.entries(opts).forEach(([method, route]) => {
      this.router.add(method, path, route)
    })
  }

  mount(port?: number, callback?: () => void) {
    const server = http.createServer((request, response) => {
      const { pathname, searchParams: query } = new URL(request.url, `${this.protocol}://${this.host}`)
      
      const { route, params } = this.router.find(request.method, pathname)

      const handler = typeof route === "function"
        ? route
        : route.handler

      const context: Context = {
        method: request.method,
        headers: request.headers,
        path: pathname,
        params,
        payload: undefined,
        query,
        raw: {
          request,
          response
        }
      }
      const helper = new Helper(response);
      const plugins = [...this.plugins, ...(typeof route === "function" ? [] : route.plugins)]
      plugins.forEach(plugin => {
        plugin.onRequest(context, helper)
      })

      const handlerResult = handler(context, helper);

      const result = plugins.reduce<unknown>((previous, current) => {
        const result = current.onPreResponse(context, helper, previous) 
        if(result) return result
        return previous
      }, handlerResult)

      helper.buildConfig()
      response.end(result);
    })

    server.listen(port || this.port, this.host)
    callback && new Promise(() => callback())
  }
} 
export const server = (opts: ServiceOptions): Server => {
  return new Server(opts)
}