#!/bin/bash
set -e

current_directory="$PWD"

cd $(dirname $0)/../infrastructure

pulumi login

INFRA_STACK_OUTPUTS=$(pulumi stack output --stack $PULUMI_INFRA_STACK --json)
STORAGE_ACCOUNT_NAME=$(echo $INFRA_STACK_OUTPUTS | jq -r '.jsStorageAccountName')
CONTAINER_NAME=$(echo $INFRA_STACK_OUTPUTS | jq -r '.jsStorageContainerName')

yarn outputs

BUNDLE_PATH=$(cat outputs.json | jq -r '.bundlePath')
BLOB_DIR=$(cat outputs.json | jq -r '.blobDir')
INDEX_JS_NAME=$(cat outputs.json | jq -r '.indexJsName')
VERSIONED_JS_NAME=$(cat outputs.json | jq -r '.versionedJsName')

az storage blob upload \
  --account-name $STORAGE_ACCOUNT_NAME \
  -f $BUNDLE_PATH \
  -c $CONTAINER_NAME \
  -n "$INDEX_JS_NAME"

if [ "$IS_PR_WORKFLOW" = true ] ; then
  BLOB_NAME=$BLOB_DIR/$(git rev-parse HEAD).js

  # uploads commit hash named blob
  az storage blob upload \
    --account-name $STORAGE_ACCOUNT_NAME \
    -f $BUNDLE_PATH \
    -c $CONTAINER_NAME \
    -n "$BLOB_NAME"

else
  # uploads version file
  az storage blob upload \
    --account-name $STORAGE_ACCOUNT_NAME \
    -f $BUNDLE_PATH \
    -c $CONTAINER_NAME \
    -n "$VERSIONED_JS_NAME"

  # purges index file from cdn
  # az cdn endpoint purge \
  # --resource-group $RESOURCE_GROUP_NAME \
  # --profile-name $PROFILE_NAME \
  # --name $ENDPOINT_NAME \
  # --content-paths "/$INDEX_JS_NAME" \
  # --no-wait
fi


result=$?

cd "$current_directory"

exit $result