#!/bin/bash
set -e

current_directory="$PWD"

cd $(dirname $0)/../infrastructure

pulumi login

if [ "$IS_PR_WORKFLOW" = true ] ; then
  PULUMI_GLOBAL_STACK=$PULUMI_GLOBAL_DEV_STACK
else
  PULUMI_GLOBAL_STACK=$PULUMI_GLOBAL_PROD_STACK
fi

GLOBAL_STACK_OUTPUTS=$(pulumi stack output --stack $PULUMI_GLOBAL_STACK --json)
EDGE_RESOURCE_GROUP_NAME=$(echo $GLOBAL_STACK_OUTPUTS | jq -r .edgeResourceGroupName)
JS_STORAGE_ACCOUNT_NAME=$(echo $GLOBAL_STACK_OUTPUTS | jq -r .jsStorageAccountName)
JS_CONTAINER_NAME=$(echo $GLOBAL_STACK_OUTPUTS | jq -r .jsContainerName)
JS_HOST=$(echo $GLOBAL_STACK_OUTPUTS | jq -r '.hostNames.js')

yarn outputs

BUNDLE_PATH=$(cat outputs.json | jq -r '.bundlePath')
BLOB_DIR=$(cat outputs.json | jq -r '.blobDir')
INDEX_JS_NAME=$(cat outputs.json | jq -r '.indexJsName')
VERSIONED_JS_NAME=$(cat outputs.json | jq -r '.versionedJsName')

echo "Uploading bundle to $JS_HOST/$INDEX_JS_NAME"

# Global Stack Upload
az storage blob upload \
  --account-name $JS_STORAGE_ACCOUNT_NAME \
  --overwrite true \
  -f $BUNDLE_PATH \
  -c $JS_CONTAINER_NAME \
  -n "$INDEX_JS_NAME"

if [ "$IS_PR_WORKFLOW" = true ] ; then
  BLOB_NAME=$BLOB_DIR/$(git rev-parse HEAD).js

  echo "Uploading bundle to $JS_HOST/$BLOB_NAME"

  # Global Stack Upload
  az storage blob upload \
    --account-name $JS_STORAGE_ACCOUNT_NAME \
    --overwrite true \
    -f $BUNDLE_PATH \
    -c $JS_CONTAINER_NAME \
    -n "$BLOB_NAME"

else
  echo "Uploading bundle to $JS_HOST/$VERSIONED_JS_NAME"

  # Global Stack Upload
  az storage blob upload \
    --account-name $JS_STORAGE_ACCOUNT_NAME \
    --overwrite true \
    -f $BUNDLE_PATH \
    -c $JS_CONTAINER_NAME \
    -n "$VERSIONED_JS_NAME"
fi


result=$?

cd "$current_directory"

exit $result
