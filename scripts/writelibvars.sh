#!/bin/bash
set -e

current_directory="$PWD"

if [ "$ENVIRONMENT" = dev ]; then
  JS_HOST="js.flock-dev.com"
  API_HOST="api.flock-dev.com"
  ELEMENTS_HOST="js.flock-dev.com"
else
  JS_HOST="js.basistheory.com"
  API_HOST="api.basistheory.com"
  ELEMENTS_HOST="js.basistheory.com"
fi

DD_TOKEN="pub5f53501515584007899577554c4aeda6"

printf 'JS_HOST=%s\n' "$JS_HOST" >> .env
printf 'API_HOST=%s\n' "$API_HOST" >> .env
printf 'ELEMENTS_HOST=%s\n' "$ELEMENTS_HOST" >> .env
printf 'DD_TOKEN=%s\n' "$DD_TOKEN" >> .env
printf 'DD_GIT_SHA=%s\n' "$DD_GIT_SHA" >> .env

result=$?

cd "$current_directory"

exit $result
