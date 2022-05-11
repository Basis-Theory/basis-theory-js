#!/bin/bash
set -e

current_directory="$PWD"

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

MAJOR_VERSION=$(cat package.json | jq -r '.version' | cut -d. -f1)
BUNDLE_PATH=../dist/basis-theory-js.bundle.js
BLOB_DIR=v$MAJOR_VERSION
INDEX_JS_NAME=$BLOB_DIR/index.js
VERSIONED_JS_NAME=$(cat package.json | jq -r '.version')


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

    az afd endpoint purge \
    --content-paths "/v1/index.js" \
    --endpoint-name "dev-edge-js" \
    -g "dev-edge" \
    --profile-name "dev-edge-afd-profile"

else
  echo "Uploading bundle to $JS_HOST/$VERSIONED_JS_NAME"

  # Global Stack Upload
  az storage blob upload \
    --account-name $JS_STORAGE_ACCOUNT_NAME \
    --overwrite true \
    -f $BUNDLE_PATH \
    -c $JS_CONTAINER_NAME \
    -n "$VERSIONED_JS_NAME"

    az afd endpoint purge \
    --content-paths "/v1/index.js" \
    --endpoint-name "prod-edge-js" \
    -g "prod-edge" \
    --profile-name "prod-edge-afd-profile"
fi


result=$?

cd "$current_directory"

exit $result
