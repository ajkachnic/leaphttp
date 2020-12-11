const{ server, Plugin } = require('../../dist/index.cjs');
const pug = require('pug')

class Pug extends Plugin {
  constructor(data = {}) {
    super();
    this.data = data
  }
  onPreResponse(_, __, response) {
    return pug.render(response, this.data)
  }
}

const app = server({
  port: 3000,
  plugins: [
  ]
})


app.route('/', {
  get: {
    handler: () => 'h1 hello world',
    plugins: [
      new Pug()
    ]
  }
})

app.mount()