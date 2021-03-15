#!/usr/bin/env bash
# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

set -e

cwd=`pwd`
script_folder=`cd $(dirname $0) && pwd`
root_version=`node $script_folder/version.js`

source $script_folder/folders.sh

# generate package.json
for folder in "${folders[@]}"
do
  sed "s/\"version\": \"0.0.0\"/\"version\": \"$root_version\"/g" $folder/package-template.json > $folder/package.json
  cp $script_folder/../LICENSE $folder/LICENSE
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

    if [ "$folder" == "src/save-button-angular" ]
    then
      cd $cwd/$folder/dist
      npm publish
    else
      npm publish
    fi
  fi
done
