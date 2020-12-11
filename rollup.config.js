import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/main.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs'
    },
    {
      file: 'dist/index.js',
      format: 'esm'
    }
  ],
  plugins: [
    typescript()
  ]
}