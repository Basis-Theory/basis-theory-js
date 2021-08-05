const fs = require('fs');
const package = require('./package.json');

// remove not required fields
delete package.scripts;
delete package.devDependencies;

// include all 'dist/*' files
package.files = ['*'];

// updates source flags removing 'dist' path
['main', 'module', 'typings'].forEach((prop) => {
  package[prop] = package[prop].replace('dist/', '');
});

fs.mkdirSync('./dist', { recursive: true });
fs.writeFileSync('./dist/package.json', JSON.stringify(package, null, 2));
