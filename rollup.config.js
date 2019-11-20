import typescript from 'rollup-plugin-typescript2';
import dts from "rollup-plugin-dts";

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/GooglePayButton.js',
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
    input: 'src/index.ts',
    output: {
      file: 'dist/GooglePayButton.d.ts',
      format: 'cjs'
    },
    plugins: [
      dts()
    ],
  },
];
