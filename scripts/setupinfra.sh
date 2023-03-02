#!/bin/bash
set -e

script_directory="$PWD"

# get bundle source
cd $(dirname $0)/../dist
dist_directory="$PWD"

# back to script directory
cd $script_directory

pulumi login

if [ "$IS_PR_WORKFLOW" = true ] ; then
  PULUMI_GLOBAL_STACK=$PULUMI_GLOBAL_DEV_STACK
else
  PULUMI_GLOBAL_STACK=$PULUMI_GLOBAL_PROD_STACK
fi

if [ "$ENVIRONMENT" = dev ] ; then
  aws s3 cp s3://basis-theory-tf-state/basistheory-cloudflare/dev/terraform.tfstate ./
else
  aws s3 cp s3://basis-theory-tf-state/basistheory-cloudflare/prod/terraform.tfstate ./
fi

GLOBAL_STACK_OUTPUTS=$(pulumi stack output --stack $PULUMI_GLOBAL_STACK --json)
EDGE_RESOURCE_GROUP_NAME=$(echo $GLOBAL_STACK_OUTPUTS | jq -r .edgeResourceGroupName)
JS_STORAGE_ACCOUNT_NAME=$(echo $GLOBAL_STACK_OUTPUTS | jq -r .jsStorageAccountName)
JS_CONTAINER_NAME=$(echo $GLOBAL_STACK_OUTPUTS | jq -r .jsContainerName)
JS_BUCKET_NAME=$(jq -r .outputs.js_bucket_name.value terraform.tfstate)

MAJOR_VERSION=$(cat package.json | jq -r '.version' | cut -d. -f1)
BUNDLE_PATH=$dist_directory/basis-theory-js.bundle.js
BLOB_DIR=v$MAJOR_VERSION
INDEX_JS_NAME=$BLOB_DIR/index.js
VERSIONED_JS_NAME=$(cat package.json | jq -r '.version')

if [ "$ENVIRONMENT" = dev ] ; then
  JS_HOST="js.flock-dev.com"
else
  JS_HOST="js.basistheory.com"
fi

echo "Uploading bundle to $JS_HOST/$INDEX_JS_NAME"

#Batch upload
aws s3 cp --acl public-read "$BUNDLE_PATH" s3://"${JS_BUCKET_NAME}"/"${INDEX_JS_NAME}"

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
  aws s3 cp --acl public-read "$BUNDLE_PATH" s3://"${JS_BUCKET_NAME}"/"${BLOB_NAME}"


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
  aws s3 cp --acl public-read "$BUNDLE_PATH" s3://"${JS_BUCKET_NAME}"/"${VERSIONED_JS_NAME}"

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

cd "$script_directory"

exit $result
