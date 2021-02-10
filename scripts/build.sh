#!/bin/bash
set -e

# verify the software

current_directory="$PWD"

cd $(dirname $0)

yarn install --froze-lock-file
yarn build

cd "$current_directory"