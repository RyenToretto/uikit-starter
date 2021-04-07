import * as WebpackDevMiddleware from 'webpack-dev-middleware'

export const devMiddleware = (compiler, opts) => {
  const middleware = WebpackDevMiddleware(compiler, opts)

  return async (ctx, next) => {
    await middleware(ctx.req, {
      end: (content) => {
        ctx.body = content
      },
      setHeader: (name, value) => {
        ctx.set(name, value)
      }
    })
  }
}
