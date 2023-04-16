import { NextFunction, Request, RequestHandler, Response } from 'express'
import z from 'zod'

type ValidatedMiddleware<TBody, TQuery, TParams> = (
  req: Request<TParams, any, TBody, TQuery>,
  res: Response,
  next: NextFunction
) => any

type SchemaDefinition<TBody, TQuery, TParams> = Partial<{
  body: z.Schema<TBody>
  query: z.Schema<TQuery>
  params: z.Schema<TParams>
}>

const check = <TType>(obj?: any, schema?: z.Schema<TType>): obj is TType => {
  if (!schema) return true
  return schema.check(obj)
}

export const validate = <TBody = unknown, TQuery = unknown, TParams = unknown>(
  schema: SchemaDefinition<TBody, TQuery, TParams>,
  middleware: ValidatedMiddleware<TBody, TQuery, TParams>
): RequestHandler => {
  return async (req, res, next) => {
    if (
      check(req.body, schema.body) &&
      check(req.query, schema.query) &&
      check(req.params, schema.params)
    ) {
      try {
        return await middleware((req as unknown) as Request<TParams, any, TBody, TQuery>, res, next)
      } catch (err) {
        next(err)
      }
    }

    if (schema.body) {
      const result = schema.body.safeParse(req.body, { path: ['body'] })
      if (!result.success) return next(result.error)
    }

    if (schema.query) {
      const result = schema.query.safeParse(req.query, { path: ['query'] })
      if (!result.success) return next(result.error)
    }

    if (schema.params) {
      const result = schema.params.safeParse(req.params, { path: ['params'] })
      if (!result.success) return next(result.error)
    }

    return next(new Error('zod-express-guard could not validate this request'))
  }
}

export const validateBody = <TBody>(
  body: z.Schema<TBody>,
  middleware: ValidatedMiddleware<TBody, unknown, unknown>
) => validate({ body }, middleware)

export const validateQuery = <TQuery>(
  query: z.Schema<TQuery>,
  middleware: ValidatedMiddleware<unknown, TQuery, unknown>
) => validate({ query }, middleware)

export const validateParams = <TParams>(
  params: z.Schema<TParams>,
  middleware: ValidatedMiddleware<unknown, unknown, TParams>
) => validate({ params }, middleware)
