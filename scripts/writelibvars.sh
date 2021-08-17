#!/bin/bash
set -e

current_directory="$PWD"

cd $(dirname $0)/../library

pulumi login

INFRA_DEV_STACK_OUTPUTS=$(pulumi stack output --stack $PULUMI_INFRA_DEV_STACK --json)
INFRA_PROD_STACK_OUTPUTS=$(pulumi stack output --stack $PULUMI_INFRA_PROD_STACK --json)

API_HOST_DEV=$(echo $INFRA_DEV_STACK_OUTPUTS | jq -r '.hostNames.api')
API_HOST_PROD=$(echo $INFRA_PROD_STACK_OUTPUTS | jq -r '.hostNames.api')

if [ "$IS_PR_WORKFLOW" = true ] ; then
  JS_HOST=$(echo $INFRA_DEV_STACK_OUTPUTS | jq -r '.hostNames.js')
else
  JS_HOST=$(echo $INFRA_PROD_STACK_OUTPUTS | jq -r '.hostNames.js')
fi

printf 'JS_HOST=%s\n' "$JS_HOST" >> .env
printf 'API_HOST_PROD=%s\n' "$API_HOST_PROD" >> .env
printf 'API_HOST_DEV=%s\n' "$API_HOST_DEV" >> .env
printf 'API_HOST_LOCAL=localhost:3333\n' >> .env

result=$?

cd "$current_directory"

exit $result