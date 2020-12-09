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

import dts from 'rollup-plugin-dts';
import typescript from 'rollup-plugin-typescript2';
import rollupJson from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/button-react/index.ts',
    output: [
      {
        file: 'src/button-react/dist/index.js',
        format: 'es',
      },
      {
        file: 'src/button-react/dist/index.min.js',
        format: 'es',
        plugins: [terser()],
      },
      {
        file: 'src/button-react/dist/index.umd.js',
        format: 'umd',
        name: 'GooglePayButton',
        globals: {
          react: 'React',
        },
      },
      {
        file: 'src/button-react/dist/index.umd.min.js',
        format: 'umd',
        name: 'GooglePayButton',
        globals: {
          react: 'React',
        },
        plugins: [terser()],
      },
    ],
    external: ['react'],
    plugins: [rollupJson(), typescript()],
  },
  {
    input: 'src/button-react/index.ts',
    output: [
      {
        file: 'src/button-react/dist/index.es5.min.js',
        format: 'umd',
        name: 'GooglePayButton',
        globals: {
          react: 'React',
        },
        plugins: [terser()],
      },
    ],
    external: ['react'],
    plugins: [
      rollupJson(),
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            target: 'es5',
          },
        },
      }),
    ],
  },
  {
    input: 'src/button-react/index.ts',
    output: {
      file: 'src/button-react/dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },

  {
    input: 'src/button-element/index.ts',
    output: [
      {
        file: 'src/button-element/dist/index.js',
        format: 'es',
        name: 'GooglePayButton',
      },
      {
        file: 'src/button-element/dist/index.min.js',
        format: 'es',
        name: 'GooglePayButton',
        plugins: [terser()],
      },
      {
        file: 'src/button-element/dist/index.umd.js',
        format: 'umd',
        name: 'GooglePayButton',
      },
      {
        file: 'src/button-element/dist/index.umd.min.js',
        format: 'umd',
        name: 'GooglePayButton',
        plugins: [terser()],
      },
    ],
    plugins: [rollupJson(), typescript()],
  },
  {
    input: 'src/button-element/index.ts',
    output: [
      {
        file: 'src/button-element/dist/index.es5.min.js',
        format: 'umd',
        name: 'GooglePayButton',
        plugins: [terser()],
      },
    ],
    plugins: [
      rollupJson(),
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            target: 'es5',
          },
        },
      }),
    ],
  },
  {
    input: 'src/button-element/index.ts',
    output: {
      file: 'src/button-element/dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];
