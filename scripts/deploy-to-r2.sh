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

if [ "${ENVIRONMENT}" = "prod" ]; then
    JS_HOST="js.basistheory.com"
    JS_BUCKET_NAME="prod-elements"
else
    JS_HOST="js.flock-dev.com"
    JS_BUCKET_NAME="dev-elements"
fi

MAJOR_VERSION=$(cat package.json | jq -r '.version' | cut -d. -f1)
BUNDLE_PATH=$dist_directory/basis-theory-js.bundle.js
BLOB_DIR=v$MAJOR_VERSION
INDEX_JS_NAME=$BLOB_DIR/index.js
VERSIONED_JS_NAME=$(cat package.json | jq -r '.version')
# create script hash file to be used in sub-resource integrity checks, i.e.
# https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity#using_shasum
JS_HASH_PATH=$BUNDLE_PATH-hash
shasum -b -a 384 $dist_directory/basis-theory-js.bundle.js | awk '{ print $1 }' | xxd -r -p | base64 > $JS_HASH_PATH

echo "Uploading bundle to $JS_HOST/$INDEX_JS_NAME"

# Upload Content
rclone --config ../.rclone.conf \
  --s3-access-key-id ${R2_ACCESS_KEY} \
  --s3-secret-access-key ${R2_SECRET_KEY} \
  copyto "$BUNDLE_PATH" s3://"${JS_BUCKET_NAME}"/"${INDEX_JS_NAME}"

rclone --config ../.rclone.conf \
  --s3-access-key-id ${R2_ACCESS_KEY} \
  --s3-secret-access-key ${R2_SECRET_KEY} \
  copyto "$JS_HASH_PATH" s3://"${JS_BUCKET_NAME}"/"${INDEX_JS_NAME}-hash"

if [ "$IS_PR_WORKFLOW" = true ] ; then
  BLOB_NAME=$BLOB_DIR/$(git rev-parse HEAD).js

  echo "Uploading bundle to $JS_HOST/$BLOB_NAME"

  rclone --config ../.rclone.conf \
    --s3-access-key-id ${R2_ACCESS_KEY} \
    --s3-secret-access-key ${R2_SECRET_KEY} \
    copyto "$BUNDLE_PATH" s3://"${JS_BUCKET_NAME}"/"${BLOB_NAME}"
  rclone --config ../.rclone.conf \
    --s3-access-key-id ${R2_ACCESS_KEY} \
    --s3-secret-access-key ${R2_SECRET_KEY} \
    copyto "$JS_HASH_PATH" s3://"${JS_BUCKET_NAME}"/"${BLOB_NAME}-hash"
else
  echo "Uploading bundle to $JS_HOST/$VERSIONED_JS_NAME"

  rclone --config ../.rclone.conf \
    --s3-access-key-id ${R2_ACCESS_KEY} \
    --s3-secret-access-key ${R2_SECRET_KEY} \
    copyto "$BUNDLE_PATH" s3://"${JS_BUCKET_NAME}"/"${VERSIONED_JS_NAME}"
  rclone --config ../.rclone.conf \
    --s3-access-key-id ${R2_ACCESS_KEY} \
    --s3-secret-access-key ${R2_SECRET_KEY} \
    copyto "$JS_HASH_PATH" s3://"${JS_BUCKET_NAME}"/"${VERSIONED_JS_NAME}-hash"
fi

result=$?

cd "$script_directory"

exit $result