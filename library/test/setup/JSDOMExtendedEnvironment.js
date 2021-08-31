// This custom environment was needed to:
//
//  - overcome internal jest/node engine issues mentioned in the tickets below
//    https://github.com/facebook/jest/issues/6248
//    https://github.com/facebook/jest/issues/7780
//
//  - polyfill (is that the right term in this case?) WebCrypto, that is not
//    available in JSDOM
//    https://github.com/jsdom/jsdom/issues/1612
//

const Crypto = require('@peculiar/webcrypto').Crypto;
const JSDOMEnvironment = require('jest-environment-jsdom');

class JSDOMExtendedEnvironment extends JSDOMEnvironment {
  constructor(config) {
    super({
      ...config,
      globals: {
        ...config.globals,
        Uint32Array,
        Uint8Array,
        ArrayBuffer,
        TextEncoder,
        TextDecoder,
      },
    });
    this.global.crypto = new Crypto();
  }
}

module.exports = JSDOMExtendedEnvironment;
