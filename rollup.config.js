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
