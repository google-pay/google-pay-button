import typescript from 'rollup-plugin-typescript2';
import dts from "rollup-plugin-dts";

export default [
  {
    input: 'src/react/index.ts',
    output: {
      file: 'src/react/dist/GooglePayButton.js',
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
    input: 'src/react/index.ts',
    output: {
      file: 'src/react/dist/GooglePayButton.d.ts',
      format: 'cjs'
    },
    plugins: [
      dts()
    ],
  },
];
