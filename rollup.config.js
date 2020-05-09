import typescript from 'rollup-plugin-typescript2';
import dts from "rollup-plugin-dts";

export default [
  {
    input: 'src/react/index.ts',
    output: {
      file: 'src/react/dist/index.js',
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
      file: 'src/react/dist/index.d.ts',
      format: 'cjs'
    },
    plugins: [
      dts()
    ],
  },

  {
    input: 'src/web-component/index.ts',
    output: {
      file: 'src/web-component/dist/index.js',
      format: 'es',
      name: 'google-pay-button'
    },
    external: [
      'react'
    ],
    plugins: [
      typescript()
    ],
  },
  {
    input: 'src/web-component/index.ts',
    output: {
      file: 'src/web-component/dist/index.d.ts',
      format: 'es'
    },
    plugins: [
      dts()
    ],
  },
];
