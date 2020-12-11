import { Context, Helper } from "helpers";

export abstract class Plugin {
  onRequest(_: Context, __: Helper) {
    return
  }
  onPreResponse(_: Context, __: Helper, ___: unknown): unknown | void {
    return
  }
}