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

  INFRA_STACK_OUTPUTS=$(pulumi stack output --stack $PULUMI_INFRA_STACK --json | jq -r '.jsStorageAccountName, .jsStorageContainerName')
  read STORAGE_ACCOUNT_NAME CONTAINER_NAME < <(echo $INFRA_STACK_OUTPUTS)

  STACK_OUTPUTS=$(pulumi stack output --json | jq -r '.bundlePath, .blobDir')
  read BUNDLE_PATH BLOB_DIR < <(echo $STACK_OUTPUTS)

  BLOB_NAME=$BLOB_DIR/$(git rev-parse HEAD).js

  # uploads commit hash named blob
  az storage blob upload \
  --account-name $STORAGE_ACCOUNT_NAME \
  -f $BUNDLE_PATH \
  -c $CONTAINER_NAME \
  -n $BLOB_NAME

else
  pulumi up -y

  INFRA_STACK_OUTPUTS=$(pulumi stack output --stack $PULUMI_INFRA_STACK --json | jq -r '.jsCdnResourceGroupName, .jsStorageAccountName, .jsCdnProfileName, .jsCdnEndpointName, .jsStorageContainerName')
  read RESOURCE_GROUP_NAME STORAGE_ACCOUNT_NAME PROFILE_NAME ENDPOINT_NAME CONTAINER_NAME < <(echo $INFRA_STACK_OUTPUTS)

  STACK_OUTPUTS=$(pulumi stack output --json | jq -r '.bundlePath, .indexJsName, .versionedJsName')
  read BUNDLE_PATH INDEX_JS_NAME VERSIONED_JS_NAME < <(echo $STACK_OUTPUTS)

  # uploads index file
  az storage blob upload \
  --account-name $STORAGE_ACCOUNT_NAME \
  -f $BUNDLE_PATH \
  -c $CONTAINER_NAME \
  -n $INDEX_JS_NAME

  # uploads version file
  az storage blob upload \
  --account-name $STORAGE_ACCOUNT_NAME \
  -f $BUNDLE_PATH \
  -c $CONTAINER_NAME \
  -n $INDEX_JS_NAME

  # purges index file from cdn
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