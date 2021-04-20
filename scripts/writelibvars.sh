#!/bin/bash
set -e

current_directory="$PWD"

cd $(dirname $0)/../library

pulumi login

INFRA_STACK_OUTPUTS=$(pulumi stack output --stack $PULUMI_INFRA_STACK --json)
JS_HOST=$(echo $INFRA_STACK_OUTPUTS | jq -r '.hostnames.js')

printf 'JS_HOST=%s\n' "$JS_HOST" >> .env

result=$?

cd "$current_directory"

exit $result