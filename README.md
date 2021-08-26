# Basis Theory JS SDK (aka BasisTheory.js)

[![Version](https://img.shields.io/npm/v/@basis-theory/basis-theory-js.svg)](https://www.npmjs.org/package/@basis-theory/basis-theory-js)
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

const bt = await new BasisTheory().init('key_N88mVGsp3sCXkykyN2EFED'); // replace with your application key
```

### Per-request configuration

All of the service methods accept an optional `RequestOptions` object. This is used if you want to set a correlation ID or if you want to set a per-request X-API-KEY

```javascript
import { v4 as uuid } from 'uuid';

await bt.applications.list(
  {},
  {
    apiKey: 'key_N88mVGsp3sCXkykyN2EFED',
    correlationId: 'aa5d3379-6385-4ef4-9fdb-ca1341572153',
  }
);
```

### Setting a custom API Url

You can set a custom API Url to be used across all clients when creating a new SDK instance.

```javascript
import { BasisTheory } from '@basis-theory/basis-theory-js';

const bt = await new BasisTheory().init('key_N88mVGsp3sCXkykyN2EFED', {
  apiBaseUrl: 'https://api.somedomain.com',
}); // replace with your application key and api base URL.
```

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
