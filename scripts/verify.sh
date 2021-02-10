#!/bin/bash
set -e

# verify the software

current_directory="$PWD"

cd $(dirname $0)

time {
    # ./dependencycheck.sh
    ./stopdocker.sh
    ./build.sh
    ./startdocker.sh
    ./checkmockserverup.sh
    ./acceptance.sh
}

cd "$current_directory"