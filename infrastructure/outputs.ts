import * as fs from 'fs';
import {
  blobDir,
  blobVersion,
  bundlePath,
  indexJsName,
  versionedJsName,
} from './infrastructure';

// eslint-disable-next-line no-console
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
