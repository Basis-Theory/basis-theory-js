#!/bin/bash
set -e

current_directory="$PWD"

cd $(dirname $0)/../library

pulumi login

INFRA_DEV_STACK_OUTPUTS=$(pulumi stack output --stack $PULUMI_INFRA_DEV_STACK --json)
INFRA_PROD_STACK_OUTPUTS=$(pulumi stack output --stack $PULUMI_INFRA_PROD_STACK --json)

JS_HOST=$(echo $INFRA_PROD_STACK_OUTPUTS | jq -r '.hostNames.js')
API_HOST=$(echo $INFRA_PROD_STACK_OUTPUTS | jq -r '.hostNames.api')
ELEMENTS_HOST=$(echo $INFRA_PROD_STACK_OUTPUTS | jq -r '.hostNames.elements')

printf 'JS_HOST=%s\n' "$JS_HOST" >> .env
printf 'API_HOST=%s\n' "$API_HOST" >> .env
printf 'ELEMENTS_HOST=%s\n' "$ELEMENTS_HOST" >> .env

result=$?

cd "$current_directory"

exit $result
