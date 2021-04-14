import * as semver from 'semver';
import * as path from 'path';
import { version, main } from '../library/package.json';

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

export const indexJsName = indexName;
export const versionedJsName = versionedName;
export const blobVersion = version;
export const blobDir = dir;
export const bundlePath = path.resolve('../library', main);

// Container file schema
//
// /v1/index.js             - latest v1 release | storage index
// /v1/1.0.0.js
// /v1/1.0.1.js

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
