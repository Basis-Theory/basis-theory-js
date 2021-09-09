#!/bin/bash
set -e

current_directory="$PWD"

cd $(dirname $0)/..

yarn lint

# unit
yarn test --coverage
# e2e
yarn test:e2e

result=$?

cd "$current_directory"

exit $result
