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

pulumi config set --secret cloudflareDnsZoneId $CLOUDFLARE_DNS_ZONE_ID

pulumi stack
if [ "$IS_PR_WORKFLOW" = true ] ; then
  pulumi preview --diff
else
  pulumi up -y
  STACK_OUTPUTS=$(pulumi stack output --json | jq -r '.resource_group_name, .cnd_profile_name, .endpoint_name, .index_js_name')
  read AZ_RESOURCE_GROUP AZ_CDN_PROFILE AZ_CDN_ENDPOINT AZ_INDEX_BLOB < <(echo $STACK_OUTPUTS)
  az cdn endpoint purge \
  --resource-group $AZ_RESOURCE_GROUP \
  --profile-name $AZ_CDN_PROFILE \
  --name $AZ_CDN_ENDPOINT \
  --content-paths "/$AZ_INDEX_BLOB" \
  --no-wait
fi

result=$?

cd "$current_directory"

exit $result