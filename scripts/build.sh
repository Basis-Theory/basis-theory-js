#!/bin/bash
set -e

# verify the software

current_directory="$PWD"

cd $(dirname $0)

yarn install --frozen-lockfile
yarn build

cd "$current_directory"
