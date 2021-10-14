import * as path from 'path';
import * as semver from 'semver';
import { version } from '../library/package.json';

// const stackName = pulumi.runtime.getStack();
const major = semver.major(version);
const prerelease = semver.prerelease(version);

// resolve blob dir (name prefix) based on version
let dir: string;

if (prerelease) {
  [dir] = prerelease;
} else {
  dir = `v${major}`;
}

const indexName = `${dir}/index.js`;
const versionedName = `${dir}/${version}.js`;

const indexJsName = indexName;
const versionedJsName = versionedName;
const blobVersion = version;
const blobDir = dir;
const bundlePath = path.resolve(
  '..',
  'library',
  'dist',
  'basis-theory-js.bundle.js'
);

export { indexJsName, versionedJsName, blobVersion, blobDir, bundlePath };

// Container file schema
//
// js(-dev).basistheory.com -> latest stable index
//

// js(-dev).basistheory.com/v1  -> rewrites to index  /v1/index.js

// /v1/index.js             - latest v1 release | storage index
// /v1/1.0.0.js
// /v1/1.0.1.js
//

// /alpha/index.js          - latest alpha prerelease
// /alpha/1.0.0-alpha.1.js
// /alpha/1.0.0-alpha.2.js

// /beta/index.js           - latest beta prerelease
// /beta/1.0.0-beta.1.js
// /beta/1.0.0-beta.2.js

// On PR workflows
// /alpha/{commithash}.js
// /beta/{commithash}.js
// /v1/{commithash}.js