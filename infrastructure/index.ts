import * as pulumi from '@pulumi/pulumi';
import * as azure from '@pulumi/azure';
import * as semver from 'semver';
import { version, main } from '../lib/package.json';

const stackName = pulumi.runtime.getStack();
const resourcePrefix = `btjs-${stackName}`;
const config = new pulumi.Config();
const major = semver.major(version);
const prerelease = semver.prerelease(version);

// Create the resource group for this stack
const resourceGroupName = resourcePrefix;
const resourceGroup = new azure.core.ResourceGroup(resourceGroupName, {
  name: resourceGroupName,
});

// Create the Storage account
const storageAccountName = `${resourcePrefix}-sa`;
const storageAccount = new azure.storage.Account(storageAccountName, {
  name: storageAccountName,
  resourceGroupName: resourceGroup.name,
  accountReplicationType: config.require('storageAccountReplicationType'),
  accountTier: config.require('storageAccountTier'),
  accountKind: 'StorageV2',
  staticWebsite: {
    indexDocument: `v${major}/index.js`,
  },
});

// Create the container
const containerName = `${resourcePrefix}-sa-js`;
const container = new azure.storage.Container(containerName, {
  name: containerName,
  storageAccountName: storageAccount.name,
  containerAccessType: 'private', // verify if CDN can access this way
});

// load the main bundle as an asset
const bundleAsset = new pulumi.asset.FileAsset(`../lib/${main}`);

// resolve blob dir (name prefix) based on version
let dir: string;
if (prerelease) {
  [dir] = prerelease;
} else {
  dir = `v${major}`;
}

// Create the index blob (updatable)
const indexName = `${dir}/index.js`;
const index = new azure.storage.Blob(
  `${resourcePrefix}-${dir}-index-js`,
  {
    name: indexName,
    storageAccountName: storageAccount.name,
    storageContainerName: container.name,
    type: 'Block',
    contentType: 'application/javascript',
    source: bundleAsset,
  },
  {
    protect: true,
  }
);

const versionedName = `${dir}/${version}.js`;
const versioned = new azure.storage.Blob(
  `${resourcePrefix}-${version}-js`,
  {
    name: versionedName,
    storageAccountName: storageAccount.name,
    storageContainerName: container.name,
    type: 'Block',
    contentType: 'application/javascript',
    source: bundleAsset,
  },
  {
    protect: true,
  }
);

const cdnName = `${resourcePrefix}-cdn`;
const cdn = new azure.cdn.Profile(cdnName, {
  name: cdnName,
  resourceGroupName: resourceGroup.name,
  sku: config.require('cdnSku'),
});

const endpointName = `${resourcePrefix}-cdn-ep`;
const endpoint = new azure.cdn.Endpoint(endpointName, {
  name: endpointName,
  resourceGroupName: resourceGroup.name,
  profileName: cdn.name,
  originHostHeader: storageAccount.primaryWebHost,
  origins: [
    {
      name: `${resourcePrefix}-cdn-ep-blob-origin`,
      hostName: storageAccount.primaryWebHost,
    },
  ],
});

export const resource_group_name = resourceGroup.name;
export const index_js_name = index.name;
export const versioned_js_name = versioned.name;
export const endpoint_name = endpoint.name;
export const cdn_url = pulumi.interpolate`https://${endpoint.hostName}/`;

// these vars are used by scripts/setupinfra.sh
process.env.AZ_RESOURCE_GROUP = resourceGroupName;
process.env.AZ_CDN_PROFILE = cdnName;
process.env.AZ_CDN_ENDPOINT = endpointName;
process.env.AZ_INDEX_BLOB = indexName;

// Container file schema
//
// /v1/index.js             - latest v1 release | storage index
// /v1/1.0.0.js
// /v1/1.0.1.js

// /alpha/index.js          - latest alpha prerelease
// /alpha/1.0.0-alpha.1.js
// /alpha/1.0.0-alpha.2.js

// /beta/index.js          - latest beta prerelease
// /beta/1.0.0-alpha.1.js
// /beta/1.0.0-alpha.2.js
