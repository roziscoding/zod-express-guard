# zod-express-guard

Small package intended to use zod to make express request type-safe.

---

<!-- all-shields/badges:START -->
[![](https://img.shields.io/github/workflow/status/roziscoding/zod-express-guard/Node.js%20CI?label=tests&style=flat-square)](https://github.com/roziscoding/zod-express-guard/actions?query=workflow%3A%22Node.js+CI%22) [![](https://img.shields.io/github/workflow/status/roziscoding/zod-express-guard/Node.js%20Package?label=build&style=flat-square)](https://github.com/roziscoding/zod-express-guard/actions?query=workflow%3A%22Node.js+Package%22) [![](https://img.shields.io/badge/latest-v1.0.4-CB3837.svg?style=flat-square&logo=npm)](https://www.npmjs.com/package/zod-express-guard) [![](https://img.shields.io/npm/l/zod-express-guard?style=flat-square)]() 
<!-- all-shields/badges:END -->
<!-- all-shields/engines:START -->
[![](https://img.shields.io/node/v/zod-express-guard?style=flat-square&logo=node.js&logoColor=white&color=339933)]() [![](https://img.shields.io/node/v-lts/zod-express-guard?style=flat-square&logo=node.js&logoColor=white&color=339933)]() 
<!-- all-shields/engines:END -->
<!-- all-shields/dependencies:START -->
[![](https://img.shields.io/npm/dependency-version/zod-express-guard/peer/zod?style=flat-square)]() [![](https://img.shields.io/npm/dependency-version/zod-express-guard/peer/express?style=flat-square)]() [![](https://img.shields.io/npm/dependency-version/zod-express-guard/peer/@types/express?style=flat-square)]() 
<!-- all-shields/dependencies:END -->

---

## Installation

Zod, Express and @types/express are peer dependencies, so you can change versions without having to
wait for me to update this library. That means you have to install them manually like this:

`npm i -D @types/express && npm i express zod`

After you've installed the peer dependencies, go ahead and install this:

`npm i zod-express-guard`

## Usage

This library exposes four validation functions, and three of them are shortcuts that end up calling
the first one.

All functions support async middlewares and will catch async errors.

### validate

This is the main function. It receives an object with the Zod schemas for what you want to validate,
together with the middleware you want to guard. If validation passes, your middleware will be called
with type-safe `req` properties. If validation fails, `next` will be called containg and instance of
`ZodError`

**Example**:

```typescript
// routes/login.ts
import z from 'zod'
import { validate } from 'zod-express-guard'

export default validate(
  {
    body: z.object({
      login: z.string().nonempty(),
      password: z.string().nonempty()
    })
  },
  (req, res) => {
    // req.body has the type { login: string, password: string }
    // req.query and req.params have type unknown, since they were not validated
    res.status(200).json({ message: 'Validation passed' })
  }
)
```

You can pass up to three properties to the first parameter: `body`, `query` and `params`, each one
validates its respective property inside `req`

### `validateBody`, `validateQuery` and `validateParams`

These three functions serve as shortcuts when you only want to validate a single property inside
`req`. This is useful for our login middleware in the previous example:

```typescript
// routes/login.ts

import z from 'zod'
import { validateBody } from 'zod-express-guard'

export default validateBody(
  z.object({
    login: z.string().nonempty(),
    password: z.string().nonempty()
  }),
  (req, res) => {
    // req.body has the type { login: string, password: string }
    // req.query and req.params have type unknown, since they were not validated
    res.status(200).json({ message: 'Validation passed' })
  }
)
```

`validateQuery` and `validateParams` work similarly, but for `req.query` and `req.params`,
respectively.

Note that, when using a shortcut function, only one of the three properties will be validated and
made acessible, and the other two will have type `unknown`

## Contributing

### Environment setup

Clone this and run `npm install` on the root.

### Making changes

Please make sure you modify the tests to reflect any changes you add.

Use `npx gitmoji -c` to commit, and follow existing commit patterns

### Running tests

Simply run `npm test` after running `npm install`.

The `package.json` already specifies a `pretest` script that will run a clean build before testing.
