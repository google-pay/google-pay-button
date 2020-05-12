#!/usr/bin/env bash
set -e

cwd=`pwd`
script_folder=`cd $(dirname $0) && pwd`
root_version=`node $script_folder/version.js`

source $script_folder/folders.sh

for folder in "${folders[@]}"
do
  sed "s/\"version\": \"0.0.0\"/\"version\": \"$root_version\"/g" $folder/package-template.json > $folder/package.json
  $script_folder/../node_modules/.bin/rimraf $folder/dist
done

$script_folder/../node_modules/.bin/rollup -c
