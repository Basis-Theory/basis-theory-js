#!/bin/bash
set -e

current_directory="$PWD"

cd $(dirname $0)/../infrastructure

pulumi login
(pulumi stack init $PULUMI_STACK) || echo "Pulumi $PULUMI_STACK already exists"
pulumi stack select $PULUMI_STACK

if [ "$IS_PR_WORKFLOW" = true ] ; then
  pulumi preview
else
  pulumi up -y
  # az cdn endpoint purge \
  # --resource-group $AZ_RESOURCE_GROUP \
  # --profile-name $AZ_CDN_PROFILE \
  # --name $AZ_CDN_ENDPOINT \
  # --content-paths "$AZ_INDEX_BLOB"
fi

result=$?

cd "$current_directory"

exit $result