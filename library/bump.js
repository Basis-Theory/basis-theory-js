// copies the version from dist/package.json to package.json, after @semantic-release/npm bumps it
const fs = require('fs');
const { version: bumpedVersion } = require('./dist/package.json');

const package = require('./package.json');

package.version = bumpedVersion;

fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
