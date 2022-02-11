#!/bin/bash
set -e

current_directory="$PWD"

cd $(dirname $0)/../library

pulumi login

if [ "$IS_PR_WORKFLOW" = true ] ; then
  GLOBAL_STACK_OUTPUTS=$(pulumi stack output --stack $PULUMI_GLOBAL_DEV_STACK --json)
else
  GLOBAL_STACK_OUTPUTS=$(pulumi stack output --stack $PULUMI_GLOBAL_PROD_STACK --json)
fi


JS_HOST=$(echo $GLOBAL_STACK_OUTPUTS | jq -r '.hostNames.js')
API_HOST=$(echo $GLOBAL_STACK_OUTPUTS | jq -r '.hostNames.api')
ELEMENTS_HOST=$(echo $GLOBAL_STACK_OUTPUTS | jq -r '.hostNames.elements')

printf 'JS_HOST=%s\n' "$JS_HOST" >> .env
printf 'API_HOST=%s\n' "$API_HOST" >> .env
printf 'ELEMENTS_HOST=%s\n' "$ELEMENTS_HOST" >> .env

result=$?

cd "$current_directory"

exit $result
