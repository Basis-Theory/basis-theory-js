// copies the version from dist/package.json to package.json, after @semantic-release/npm bumps it
const fs = require('fs');
const distPackage = require('./dist/package.json');
const libPackage = require('./package.json');

libPackage.version = distPackage.version;

fs.writeFileSync(
  './package.json',
  `${JSON.stringify(libPackage, undefined, 2)}\n`
);

// removes dist package scripts before publish
delete distPackage.scripts;
fs.writeFileSync(
  './dist/package.json',
  JSON.stringify(distPackage, undefined, 2)
);
