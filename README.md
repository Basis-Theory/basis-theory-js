# Basis Theory JS SDK (aka BasisTheory.js)

> [!CAUTION]
> This SDK has been deprecated for node and web use. It is still supported for use in reactor environments.
>
> - Our new Node.js SDK can be found at https://github.com/Basis-Theory/node-sdk
>
>   - See our documentation site for more information. https://developers.basistheory.com/docs/sdks/server-side/node
>
> - Our new web elements package can be found at https://github.com/Basis-Theory/web-elements
>   - See our documentation site for more information. https://developers.basistheory.com/docs/sdks/web/web-elements

[![Version](https://img.shields.io/npm/v/@basis-theory/basis-theory-js.svg)](https://www.npmjs.org/package/@basis-theory/basis-theory-js)
[![Downloads](https://img.shields.io/npm/dm/@basis-theory/basis-theory-js.svg)](https://www.npmjs.org/package/@basis-theory/basis-theory-js)
[![Verify](https://github.com/Basis-Theory/basis-theory-js/actions/workflows/release.yml/badge.svg)](https://github.com/Basis-Theory/basis-theory-js/actions/workflows/release.yml)

The [Basis Theory](https://basistheory.com/) JS SDK

## Installation

Using [Node Package Manager](https://docs.npmjs.com/)

```sh
npm install --save @basis-theory/basis-theory-js
```

Using [Yarn](https://classic.yarnpkg.com/en/docs/)

```sh
yarn add @basis-theory/basis-theory-js
```

## Documentation

For a complete list of endpoints and examples, please refer to our [API docs](https://docs.basistheory.com/api-reference/?javascript#introduction)

## Usage

### Initialization

```javascript
import { BasisTheory } from '@basis-theory/basis-theory-js';

const bt = await new BasisTheory().init('<API Key>'); // replace with your application key
```

### Per-request configuration

All of the service methods accept an optional `RequestOptions` object. This is used if you want to set a per-request `BT-TRACE-ID`, `BT-API-KEY` and/or `BT-IDEMPOTENCY-KEY`.

```javascript
import { v4 as uuid } from 'uuid';

await bt.applications.list(
  {},
  {
    apiKey: '<Management API Key>',
    correlationId: 'aa5d3379-6385-4ef4-9fdb-ca1341572153',
    idempotencyKey: 'bb5d3379-6385-4ef4-9fdb-ca1341572154',
  }
);

await bt.tokens.create(
  {
    type: "token",
    data: "Sensitive Value",
  },
  {
    apiKey: '<API Key>',
    correlationId: 'aa5d3379-6385-4ef4-9fdb-ca1341572153',
    idempotencyKey: 'bb5d3379-6385-4ef4-9fdb-ca1341572154',
  }
);
```

### Setting a custom API Url

You can set a custom API Url to be used across all clients when creating a new SDK instance.

```javascript
import { BasisTheory } from '@basis-theory/basis-theory-js';

const bt = await new BasisTheory().init('<API Key>', {
  apiBaseUrl: 'https://api.somedomain.com',
}); // replace with your application key and api base URL.
```

### Elements

Please, refer to the [Elements Documentation](https://docs.basistheory.com/elements) on how to use it.

## Development

The provided scripts with the SDK will check for all dependencies, start docker, build the solution, and run all tests.

### Dependencies

- [Docker](https://www.docker.com/products/docker-desktop)
- [Docker Compose](https://www.docker.com/products/docker-desktop)
- [NodeJS](https://nodejs.org/en/) > 10.12.0
- [Yarn](https://classic.yarnpkg.com/en/docs/)

### Build the SDK and run Tests

Run the following command from the root of the project:

```sh
make verify
```
