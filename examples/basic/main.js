const { server } = require('../../dist/index.cjs');

const app = server({
  port: 3000,
  plugins: []
})

app.route('/', {
  get: () => 'hello world'
})

app.mount()
console.log('running')