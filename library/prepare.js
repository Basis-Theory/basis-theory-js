const fs = require('fs');
const package = require('./package.json');

// remove not required fields
delete package.devDependencies;

// use only required temporary script in dist
package.scripts = {
  postversion: 'cd .. && node bump.js',
};

// include all 'dist/*' files
package.files = ['*'];

// updates source flags removing 'dist' path
['main', 'module', 'typings'].forEach((prop) => {
  package[prop] = package[prop].replace('dist/', '');
});

fs.mkdirSync('./dist', { recursive: true });
fs.copyFileSync('../README.md', './dist/README.md');
fs.copyFileSync('../LICENSE', './dist/LICENSE');
fs.writeFileSync('./dist/package.json', JSON.stringify(package, null, 2));
