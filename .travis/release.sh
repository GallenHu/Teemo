#!/bin/sh
repo="${TRAVIS_REPO_SLUG}" # Gallen/Teemo
name1=${repo//\//-}
name2=`echo ${name1}| tr '[:upper:]' '[:lower:]'`

mkdir -p /tmp/my-travis-build/${name2}
# /tmp/my-travis-build/gallen-v2-subscriber
cp -rf ./build /tmp/my-travis-build/${name2}

cd /tmp/my-travis-build/
sshpass -p "${SERVER_PWD}" scp -P 1991 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -r ${name2} root@qhk.199100.xyz:/home/wwwroot/
