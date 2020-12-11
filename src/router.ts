import { Context, Helper } from 'helpers'
import { match, MatchResult } from 'path-to-regexp'
import { Plugin } from 'plugin'

export type Handler = (ctx: Context, h: Helper) => unknown
export type Route = {
  handler: Handler, 
  plugins?: Plugin[]
}
export type RouteOptions = {
  get?: Route | Handler,
  head?: Route | Handler,
  post?: Route | Handler,
  put?: Route | Handler,
  delete?: Route | Handler,
  connect?: Route | Handler,
  options?: Route | Handler,
  trace?: Route | Handler,
  patch?: Route | Handler,
  [key: string]: Route | Handler
}

type InternalRoute = {
  method: string,
  path: string,
  route: Route | Handler,
}

export class Router {
  routes: InternalRoute[] = [];
  add(method: string, path: string, route: Route | Handler) {
    this.routes.push({
      method,
      path,
      route
    })
  }

  find(method: string, url: string): InternalRoute & {
    params: Record<string, string>
  } {
    const relevant = this.routes.filter(route => route.method.toLowerCase() === route.method.toLowerCase())
    const checkMatch = match(url, { decode: decodeURIComponent })
    let matchingRoute: InternalRoute;
    let params = {};
    relevant.some(route => {
      console.log(route.path, url)
      const check = checkMatch(route.path)
      if(check !== false) {
        params = (check as MatchResult).params;
        matchingRoute = route
        return true
      }
      return false
    })

    if(matchingRoute) {
      return { ...matchingRoute, params }
    } else {
      return {
        method,
        path: url,
        route: () => 'page not found',
        params: {}
      }
    }
  }
}