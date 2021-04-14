import * as pulumi from '@pulumi/pulumi';
import * as cloudflare from '@pulumi/cloudflare';
import * as cdn from '@pulumi/azure-nextgen/cdn/latest';
import * as resources from '@pulumi/azure-nextgen/resources/latest';
import * as storage from '@pulumi/azure-nextgen/storage/latest';

import * as semver from 'semver';
import * as path from 'path';

import { assertCloudflareDns } from './utils';
import { version, main } from '../library/package.json';

const stackName = pulumi.runtime.getStack();
const resourcePrefix = `btjs-${stackName}`;
const config = new pulumi.Config();
const major = semver.major(version);
const prerelease = semver.prerelease(version);

// Create the resource group for this stack
const resourceGroupName = resourcePrefix;
const resourceGroup = new resources.ResourceGroup(resourceGroupName, {
  resourceGroupName,
});

// Create the Storage account
const storageAccountName = `btjs${stackName}sa`; // must be lower case and numbers only
const storageAccount = new storage.StorageAccount(storageAccountName, {
  accountName: storageAccountName,
  resourceGroupName: resourceGroup.name,
  kind: 'StorageV2',
  sku: {
    name: config.require('storageAccountSku'),
  },
});

// Create the website (along with $web container)
const websiteName = `${storageAccountName}-ws`;
const website = new storage.StorageAccountStaticWebsite(websiteName, {
  accountName: storageAccount.name,
  resourceGroupName: resourceGroup.name,
});

const bundlePath = path.resolve('../library', main);

// load the main bundle as an asset
const bundleAsset = new pulumi.asset.FileAsset(bundlePath);

// resolve blob dir (name prefix) based on version
let dir: string;
if (prerelease) {
  [dir] = prerelease;
} else {
  dir = `v${major}`;
}

// Create the index blob (updatable)
const indexName = `${dir}/index.js`;
const index = new storage.Blob(
  `${resourcePrefix}-${dir}-index-js`,
  {
    blobName: indexName,
    accountName: storageAccount.name,
    containerName: website.containerName,
    resourceGroupName: resourceGroup.name,
    type: 'Block',
    contentType: 'application/javascript',
    source: bundleAsset,
  },
  {
    // protect: true,
  }
);

const versionedName = `${dir}/${version}.js`;
const versioned = new storage.Blob(
  `${resourcePrefix}-${version}-js`,
  {
    blobName: versionedName,
    accountName: storageAccount.name,
    containerName: website.containerName,
    resourceGroupName: resourceGroup.name,
    type: 'Block',
    contentType: 'application/javascript',
    source: bundleAsset,
  },
  {
    // protect: true,
  }
);

// Create the CDN Profile
const profileName = `${resourcePrefix}-cdn`;
const cdnProfile = new cdn.Profile(profileName, {
  profileName,
  resourceGroupName: resourceGroup.name,
  sku: {
    name: config.require('cdnSku'),
  },
});

const webOriginHost = storageAccount.primaryEndpoints.web.apply(
  (url) => new URL(url).host
);

// Create the CDN endpoint
const endpointName = `${resourcePrefix}-cdn-ep`;
const endpoint = new cdn.Endpoint(endpointName, {
  endpointName,
  profileName: cdnProfile.name,
  resourceGroupName: resourceGroup.name,
  originHostHeader: webOriginHost,
  origins: [
    {
      name: `${endpointName}-blob-origin`,
      hostName: webOriginHost,
    },
  ],
  isHttpAllowed: false,
  isCompressionEnabled: true,
  contentTypesToCompress: ['application/javascript'],

  // TODO resume this when it is relevant again
  // deliveryPolicy: {
  //   rules: [
  //     {
  //       order: 0,
  //       name: 'RewriteToJS',
  //       conditions: [{
  //         name: 'UrlFileExtension',
  //         parameters: {
  //           operator: ''
  //         }
  //       }],
  //       actions: [
  //         {
  //           name: 'UrlRewrite',
  //           parameters: {
  //             sourcePattern: '/',
  //             destination: '',
  //             odataType:
  //               '#Microsoft.Azure.Management.Cdn.Models.UrlRewriteActionParameters',
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
});

// Create DNS CNAME record
// const recordName = `${resourcePrefix}-cname`;
// const cname = new cloudflare.Record(recordName, {
//   name: config.require('cname'), // js-dev / js
//   value: endpoint.hostName,
//   zoneId: config.requireSecret('cloudflareDnsZoneId'),
//   type: 'CNAME',
//   proxied: false,
// });

// resolve domain hostname, waiting dns replication
// const domainHostname = pulumi
//   .all([cname.name, endpoint.hostName])
//   .apply(async ([cname, endpointHostname]) => {
//     const hostname = `${cname}.basistheory.com`;
//     await assertCloudflareDns(hostname, endpointHostname);
//     return hostname;
//   });

// Bind a CDN Custom Domain to the record
// const customDomainName = `${resourcePrefix}-cdn-domain`;
// const domain = new cdn.CustomDomain(customDomainName, {
//   customDomainName,
//   endpointName: endpoint.name,
//   hostName: domainHostname,
//   profileName: cdnProfile.name,
//   resourceGroupName: resourceGroup.name,
// });

export const cdn_url = pulumi.interpolate`https://${endpoint.hostName}/`;
export const resource_group_name = resourceGroup.name;
export const cnd_profile_name = cdnProfile.name;
export const index_js_name = index.name;
export const versioned_js_name = versioned.name;
export const endpoint_name = endpoint.name;
export const storage_account = storageAccount.name;
// export const cname_hostname = cname.hostname;
// export const endpoint_domain = domain.hostName;

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
