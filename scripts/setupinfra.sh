#!/bin/bash
set -e

current_directory="$PWD"

cd $(dirname $0)/../infrastructure

pulumi login
(pulumi stack init $PULUMI_STACK) || echo "Pulumi $PULUMI_STACK already exists"
pulumi stack select $PULUMI_STACK

pulumi stack
if [ "$IS_PR_WORKFLOW" = true ] ; then
  pulumi preview
  STACK_OUTPUTS=$(pulumi stack output --json | jq -r '.resource_group_name, .cnd_profile_name, .endpoint_name, .index_js_name')
  read AZ_RESOURCE_GROUP AZ_CDN_PROFILE AZ_CDN_ENDPOINT AZ_INDEX_BLOB < <(echo $STACK_OUTPUTS)
  echo $AZ_RESOURCE_GROUP $AZ_CDN_PROFILE $AZ_CDN_ENDPOINT $AZ_INDEX_BLOB
else
  pulumi up -y
  STACK_OUTPUTS=$(pulumi stack output --json | jq -r '.resource_group_name, .cnd_profile_name, .endpoint_name, .index_js_name')
  read AZ_RESOURCE_GROUP AZ_CDN_PROFILE AZ_CDN_ENDPOINT AZ_INDEX_BLOB < <(echo $STACK_OUTPUTS)
  az cdn endpoint purge \
  --resource-group $AZ_RESOURCE_GROUP \
  --profile-name $AZ_CDN_PROFILE \
  --name $AZ_CDN_ENDPOINT \
  --content-paths "$AZ_INDEX_BLOB"
fi

result=$?

cd "$current_directory"

exit $result