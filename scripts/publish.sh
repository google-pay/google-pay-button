#!/usr/bin/env bash
set -e

cwd=`pwd`
script_folder=`cd $(dirname $0) && pwd`
root_version=`node $script_folder/version.js`

folders=("src/react" "src/web-component")

# generate package.json
for folder in "${folders[@]}"
do
  sed "s/\"version\": \"0.0.0\"/\"version\": \"$root_version\"/g" $folder/package-template.json > $folder/package.json
done

# publish
for folder in "${folders[@]}"
do
  cd $cwd/$folder
  if current_version=`npm view . version` ; then
    echo "existing package version $current_version"
  fi

  version=`node $script_folder/version.js package.json` 
  if [ "$current_version" != "$version" ]
  then
    echo "publishing $version"
    npm publish
  fi
done
