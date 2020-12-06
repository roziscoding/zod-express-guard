import { assert, expect } from 'chai'
import sinon from 'sinon'
import * as z from 'zod'
import { validate } from '../src'

describe('Validate', () => {
  describe('body', () => {
    describe('when validation does not pass', () => {
      const middleware = sinon.fake()
      const next = sinon.fake()
      const req = { body: {} } as any
      const guardedMiddleware = validate({ body: z.object({ dummy: z.string() }) }, middleware)

      guardedMiddleware(req, null as any, next)

      it('calls next with a ZodError', () => {
        assert(next.calledWith(sinon.match.instanceOf(z.ZodError)))
      })

      it('does not call the given middleware', () => {
        assert(middleware.notCalled)
      })

      it('sets the `path` parameter on the zod error to `body`', () => {
        const firstCall = next.args[0]
        const error = firstCall ? (firstCall[0] as z.ZodError) : undefined
        expect(error?.errors[0]).to.have.property('path').which.includes('body')
      })
    })

    describe('when validation passes', () => {
      const middleware = sinon.fake()
      const next = sinon.fake()
      const req = { body: { login: 'dummy' } } as any
      const guardedMiddleware = validate({ body: z.object({ login: z.string() }) }, middleware)

      guardedMiddleware(req, null as any, next)

      it('calls the given middleware', () => {
        assert(middleware.calledWith(req, null, next))
      })

      it('does not call next', () => {
        assert(next.notCalled)
      })
    })
  })

  describe('query', () => {
    describe('when validation does not pass', () => {
      const middleware = sinon.fake()
      const next = sinon.fake()
      const req = { query: {} } as any
      const guardedMiddleware = validate({ query: z.object({ dummy: z.string() }) }, middleware)

      guardedMiddleware(req, null as any, next)

      it('calls next with a ZodError', () => {
        assert(next.calledWith(sinon.match.instanceOf(z.ZodError)))
      })

      it('does not call the given middleware', () => {
        assert(middleware.notCalled)
      })

      it('sets the `path` parameter on the zod error to `query`', () => {
        const firstCall = next.args[0]
        const error = firstCall ? (firstCall[0] as z.ZodError) : undefined
        expect(error?.errors[0]).to.have.property('path').which.includes('query')
      })
    })

    describe('when validation passes', () => {
      const middleware = sinon.fake()
      const next = sinon.fake()
      const req = { query: { name: 'dummy' } } as any
      const guardedMiddleware = validate({ query: z.object({ name: z.string() }) }, middleware)

      guardedMiddleware(req, null as any, next)

      it('calls given middleware', () => {
        assert(middleware.calledWith(req, null, next))
      })

      it('does not call next', () => {
        assert(next.notCalled)
      })
    })
  })

  describe('params', () => {
    describe('when validation does not pass', () => {
      const middleware = sinon.fake()
      const next = sinon.fake()
      const req = { params: {} } as any
      const guardedMiddleware = validate({ params: z.object({ dummy: z.string() }) }, middleware)

      guardedMiddleware(req, null as any, next)

      it('calls next with a ZodError', () => {
        assert(next.calledWith(sinon.match.instanceOf(z.ZodError)))
      })

      it('does not call the given middleware', () => {
        assert(middleware.notCalled)
      })

      it('sets the `path` parameter on the zod error to `params`', () => {
        const firstCall = next.args[0]
        const error = firstCall ? (firstCall[0] as z.ZodError) : undefined
        expect(error?.errors[0]).to.have.property('path').which.includes('params')
      })
    })

    describe('when validation passes', () => {
      const middleware = sinon.fake()
      const next = sinon.fake()
      const req = { params: { name: 'dummy' } } as any
      const guardedMiddleware = validate({ params: z.object({ name: z.string() }) }, middleware)

      guardedMiddleware(req, null as any, next)

      it('calls given middleware', () => {
        assert(middleware.calledWith(req, null, next))
      })

      it('does not call next', () => {
        assert(next.notCalled)
      })
    })
  })
})
