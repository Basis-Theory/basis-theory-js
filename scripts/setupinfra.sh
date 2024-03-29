#!/bin/bash
set -e

script_directory="$PWD"

# get bundle source
cd $(dirname $0)/../dist
dist_directory="$PWD"

# back to script directory
cd $script_directory

if [[ -z "${ENVIRONMENT}" ]]; then
    echo "environment variable is not set"
    exit 1
fi

if [ "${ENVIRONMENT}" = dev  ]; then
    JS_HOST="js.flock-dev.com"
else
    JS_HOST="js.basistheory.com"
fi

MAJOR_VERSION=$(cat package.json | jq -r '.version' | cut -d. -f1)
BUNDLE_PATH=$dist_directory/basis-theory-js.bundle.js
BLOB_DIR=v$MAJOR_VERSION
INDEX_JS_NAME=$BLOB_DIR/index.js
VERSIONED_JS_NAME=$(cat package.json | jq -r '.version')

echo "Uploading bundle to $JS_HOST/$INDEX_JS_NAME"

if [[ -z ${AWS} ]]; then
  JS_BUCKET_NAME=$(aws s3 cp s3://basis-theory-tf-state/basistheory-cloudflare/$ENVIRONMENT/terraform.tfstate - | jq -r .outputs.js_bucket_name.value)
else
  JS_BUCKET_NAME="${ENVIRONMENT}-${JS_HOST}"
fi

# Upload Contnet
aws s3 cp --acl public-read "$BUNDLE_PATH" s3://"${JS_BUCKET_NAME}"/"${INDEX_JS_NAME}"

if [ "$IS_PR_WORKFLOW" = true ] ; then
  BLOB_NAME=$BLOB_DIR/$(git rev-parse HEAD).js

  echo "Uploading bundle to $JS_HOST/$BLOB_NAME"

  aws s3 cp --acl public-read "$BUNDLE_PATH" s3://"${JS_BUCKET_NAME}"/"${BLOB_NAME}"
else
  echo "Uploading bundle to $JS_HOST/$VERSIONED_JS_NAME"

  aws s3 cp --acl public-read "$BUNDLE_PATH" s3://"${JS_BUCKET_NAME}"/"${VERSIONED_JS_NAME}"
fi

result=$?

cd "$script_directory"

exit $result
