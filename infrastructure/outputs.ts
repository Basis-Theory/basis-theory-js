import {
  blobDir,
  blobVersion,
  bundlePath,
  indexJsName,
  versionedJsName,
} from './';

import * as fs from 'fs';

console.log('Generation ouputs.json file');

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
