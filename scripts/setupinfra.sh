#!/bin/bash
set -e

current_directory="$PWD"

cd $(dirname $0)/../infrastructure

if [[ -z "${AZURE_CREDENTIALS}" ]]; then
    echo "AZURE_CREDENTIALS environment variable is not set"
    exit 1
fi

export ARM_CLIENT_ID=$(echo $AZURE_CREDENTIALS | python3 -c "import sys, json; print(json.load(sys.stdin)['clientId'])")
export ARM_CLIENT_SECRET=$(echo $AZURE_CREDENTIALS | python3 -c "import sys, json; print(json.load(sys.stdin)['clientSecret'])")
export ARM_SUBSCRIPTION_ID=$(echo $AZURE_CREDENTIALS | python3 -c "import sys, json; print(json.load(sys.stdin)['subscriptionId'])")
export ARM_TENANT_ID=$(echo $AZURE_CREDENTIALS | python3 -c "import sys, json; print(json.load(sys.stdin)['tenantId'])")

pulumi login
(pulumi stack init $PULUMI_STACK) || echo "Pulumi $PULUMI_STACK already exists"
pulumi stack select $PULUMI_STACK

pulumi stack


if [ "$IS_PR_WORKFLOW" = true ] ; then
  pulumi preview --diff

  STACK_OUTPUTS=$(pulumi stack output --json | jq -r '.bundlePath, .jsStorageContainerName, .blobDir')
  read BUNDLE_PATH CONTAINER_NAME BLOB_DIR < <(echo $STACK_OUTPUTS)

  BLOB_NAME=$BLOB_DIR/$(git rev-parse HEAD).js

  az storage blob upload \
  -f $BUNDLE_PATH \
  -c $CONTAINER_NAME \
  -n $BLOB_NAME

else
  pulumi up -y

  STACK_OUTPUTS=$(pulumi stack output --json | jq -r '.jsCdnResourceGroupName, .jsCdnProfileName, .jsCdnEndpointName, .jsStorageContainerName, .bundlePath, .indexJsName, .versionedJsName')
  read RESOURCE_GROUP_NAME PROFILE_NAME ENDPOINT_NAME CONTAINER_NAME BUNDLE_PATH INDEX_JS_NAME VERSIONED_JS_NAME < <(echo $STACK_OUTPUTS)

  # uploads index file
  az storage blob upload \
  -f $BUNDLE_PATH \
  -c $CONTAINER_NAME \
  -n $INDEX_JS_NAME

  # uploads index file
  az storage blob upload \
  -f $BUNDLE_PATH \
  -c $CONTAINER_NAME \
  -n $INDEX_JS_NAME

  az cdn endpoint purge \
  --resource-group $RESOURCE_GROUP_NAME \
  --profile-name $PROFILE_NAME \
  --name $ENDPOINT_NAME \
  --content-paths "/$INDEX_JS_NAME" \
  --no-wait

fi


result=$?

cd "$current_directory"

exit $result