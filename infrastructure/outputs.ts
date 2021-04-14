import {
  blobDir,
  blobVersion,
  bundlePath,
  indexJsName,
  versionedJsName,
} from './';

import * as fs from 'fs';

console.log('Generating outputs.json file');

fs.writeFileSync(
  './outputs.json',
  JSON.stringify({
    indexJsName,
    versionedJsName,
    blobVersion,
    blobDir,
    bundlePath,
  })
);
