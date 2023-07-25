#!/bin/bash
set -e

current_directory="$PWD"

if [ "$ENVIRONMENT" = dev ]; then
  JS_HOST="js.flock-dev.com"
  API_HOST="api.flock-dev.com"
  ELEMENTS_HOST="js.flock-dev.com/hosted-elements"
else
  JS_HOST="js.basistheory.com"
  API_HOST="api.basistheory.com"
  ELEMENTS_HOST="js.basistheory.com/hosted-elements"
fi

printf 'JS_HOST=%s\n' "$JS_HOST" >> .env
printf 'API_HOST=%s\n' "$API_HOST" >> .env
printf 'ELEMENTS_HOST=%s\n' "$ELEMENTS_HOST" >> .env

result=$?

cd "$current_directory"

exit $result
