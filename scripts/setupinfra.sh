#!/bin/bash
set -e

current_directory="$PWD"

cd $(dirname $0)/../infrastructure

az login

pulumi login

if [ "$IS_PR_WORKFLOW" = true ] ; then
  PULUMI_INFRA_STACK=$PULUMI_INFRA_DEV_STACK
  PULUMI_GLOBAL_STACK=$PULUMI_GLOBAL_DEV_STACK
else
  PULUMI_INFRA_STACK=$PULUMI_INFRA_PROD_STACK
  PULUMI_GLOBAL_STACK=$PULUMI_GLOBAL_PROD_STACK
fi

INFRA_STACK_OUTPUTS=$(pulumi stack output --stack $PULUMI_INFRA_STACK --json)
STORAGE_ACCOUNT_NAME=$(echo $INFRA_STACK_OUTPUTS | jq -r '.jsStorageAccountName')
CONTAINER_NAME=$(echo $INFRA_STACK_OUTPUTS | jq -r '.jsStorageContainerName')
JS_HOST=$(echo $INFRA_STACK_OUTPUTS | jq -r '.hostNames.js')

GLOBAL_STACK_OUTPUTS=$(pulumi stack output --stack $PULUMI_GLOBAL_STACK --json)
EDGE_RESOURCE_GROUP_NAME=$(echo $GLOBAL_STACK_OUTPUTS | jq -r .edgeResourceGroupName)
JS_STORAGE_ACCOUNT_NAME=$(echo $GLOBAL_STACK_OUTPUTS | jq -r .jnStorageAccountName)
JS_CONTAINER_NAME=$(echo $GLOBAL_STACK_OUTPUTS | jq -r .jsContainerName)

yarn outputs

BUNDLE_PATH=$(cat outputs.json | jq -r '.bundlePath')
BLOB_DIR=$(cat outputs.json | jq -r '.blobDir')
INDEX_JS_NAME=$(cat outputs.json | jq -r '.indexJsName')
VERSIONED_JS_NAME=$(cat outputs.json | jq -r '.versionedJsName')

echo "Uploading bundle to $JS_HOST/$INDEX_JS_NAME"

az storage blob upload \
  --account-name $STORAGE_ACCOUNT_NAME \
  -f $BUNDLE_PATH \
  -c $CONTAINER_NAME \
  -n "$INDEX_JS_NAME"

# Global Stack Upload
az storage blob upload \
  --account-name $JS_STORAGE_ACCOUNT_NAME \
  -f $BUNDLE_PATH \
  -c $JS_CONTAINER_NAME \
  -n "$INDEX_JS_NAME"

if [ "$IS_PR_WORKFLOW" = true ] ; then
  BLOB_NAME=$BLOB_DIR/$(git rev-parse HEAD).js

  echo "Uploading bundle to $JS_HOST/$BLOB_NAME"

  # uploads commit hash named blob
  az storage blob upload \
    --account-name $STORAGE_ACCOUNT_NAME \
    -f $BUNDLE_PATH \
    -c $CONTAINER_NAME \
    -n "$BLOB_NAME"

# Global Stack Upload
az storage blob upload \
  --account-name $JS_STORAGE_ACCOUNT_NAME \
  -f $BUNDLE_PATH \
  -c $JS_CONTAINER_NAME \
  -n "$BLOB_NAME"

else
  echo "Uploading bundle to $JS_HOST/$VERSIONED_JS_NAME"

  # uploads version file
  az storage blob upload \
    --account-name $STORAGE_ACCOUNT_NAME \
    -f $BUNDLE_PATH \
    -c $CONTAINER_NAME \
    -n "$VERSIONED_JS_NAME"

# Global Stack Upload
az storage blob upload \
  --account-name $JS_STORAGE_ACCOUNT_NAME \
  -f $BUNDLE_PATH \
  -c $JS_CONTAINER_NAME \
  -n "$VERSIONED_JS_NAME"
fi


result=$?

cd "$current_directory"

exit $result
