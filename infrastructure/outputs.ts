import {
  blobDir,
  blobVersion,
  bundlePath,
  indexJsName,
  versionedJsName,
} from './';

console.log(
  JSON.stringify({
    indexJsName,
    versionedJsName,
    blobVersion,
    blobDir,
    bundlePath,
  })
);
