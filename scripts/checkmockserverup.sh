#!/bin/bash

RED="\033[1;31m"
GREEN="\033[1;32m"
NOCOLOR="\033[0m"

i=0
timeout=30000

# continue until $n equals 5
while [ $i -le $timeout ]
do
	status=$(curl -s -o /dev/null -i -w "%{http_code}" http://localhost:3000/)

    if [ $status == "200" ]
    then
        echo -e "${GREEN}✓${NOCOLOR} mock-server is ready"
        exit 0
    else
        echo -e "❌ mock-server is not ready"

        sleep 3
	    i=$(( i+3000 ))	 # increments $n
    fi
done

echo 'Health check did not pass within timeout'
docker ps -a
docker logs mock-server
exit 1
