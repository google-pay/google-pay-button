#!/usr/bin/env bash
# Copyright 2026 Google LLC
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

echo "Verifying build outputs..."

# 1. Verify React component
if [ ! -f "src/button-react/dist/index.js" ] || [ ! -f "src/button-react/dist/index.d.ts" ]; then
  echo "Error: React component build files are missing in src/button-react/dist/"
  exit 1
fi

# 2. Verify Custom Element
if [ ! -f "src/button-element/dist/index.js" ] || [ ! -f "src/button-element/dist/index.d.ts" ]; then
  echo "Error: Custom Element build files are missing in src/button-element/dist/"
  exit 1
fi

# 3. Verify Angular component
if [ ! -f "src/button-angular/dist/fesm2022/google-pay-button-angular.mjs" ] || [ ! -f "src/button-angular/dist/types/google-pay-button-angular.d.ts" ]; then
  echo "Error: Angular component build files are missing in src/button-angular/dist/"
  exit 1
fi

echo "All build outputs verified successfully!"
