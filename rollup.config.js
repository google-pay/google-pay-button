/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import dts from "rollup-plugin-dts";
import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/button-react/index.ts',
    output: {
      file: 'src/button-react/dist/index.js',
      format: 'cjs'
    },
    external: [
      'react'
    ],
    plugins: [
      typescript()
    ],
  },
  {
    input: 'src/button-react/index.ts',
    output: {
      file: 'src/button-react/dist/index.d.ts',
      format: 'cjs'
    },
    plugins: [
      dts()
    ],
  },

  {
    input: 'src/button-element/index.ts',
    output: {
      file: 'src/button-element/dist/index.js',
      format: 'es',
      name: 'google-pay-button'
    },
    plugins: [
      typescript()
    ],
  },
  {
    input: 'src/button-element/index.ts',
    output: {
      file: 'src/button-element/dist/index.d.ts',
      format: 'es'
    },
    plugins: [
      dts()
    ],
  },
];
