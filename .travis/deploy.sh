#!/bin/sh
repo="${TRAVIS_REPO_SLUG}" # GallenHu/Teemo
repo_name1=${repo//\//-}
repo_name2=`echo ${name1}| tr '[:upper:]' '[:lower:]'`

mkdir -p /tmp/my-travis-build/${repo_name2}
cp -rf ./build/ /tmp/my-travis-build/${repo_name2}

echo ${repo_name2}
cd /tmp/my-travis-build/
ls
sshpass -p "${SERVER_PWD}" scp -P 1991 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -r ${repo_name2} root@qhk.nicebook.win:/home/wwwroot/
