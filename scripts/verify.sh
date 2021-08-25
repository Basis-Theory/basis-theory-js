#!/bin/bash
set -e

# verify the software

current_directory="$PWD"

cd $(dirname $0)

time {
    ./build.sh
    ./acceptance.sh
}

cd "$current_directory"
