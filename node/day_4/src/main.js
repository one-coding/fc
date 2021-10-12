// @ts-check

// Tempalte engine: Pug
// CSS framework: TailwindCSS

/**
 * @typedef Chat
 * @property {string} nickname
 * @property {string} message
 */

const Koa = require('koa')
const path = require('path')
const Pug = require('koa-pug')
const serve = require('koa-static')
const mount = require('koa-mount')

const route = require('koa-route')
const websockify = require('koa-websocket')
const mongoClient = require('./mongo')

const app = websockify(new Koa())

/* eslint-disable no-new */
// @ts-ignore
new Pug({
  viewPath: path.resolve(__dirname, './views'),
  app,
  //   locals: {},
  //   baseDir: 'path/for/pug/extends',
  //   helperPath: [
  //     'path/to/pug/helpers',
  //     { random: 'path/to/lib/random.js' },
  //     { _: require('lodash') },
  //   ],
})
app.use(mount('/public', serve('src/public')))

app.use(async (ctx) => {
  await ctx.render('main')
})

/* eslint-disable-next-line no-underscore-dangle */
const _client = mongoClient.connect()

async function getChatsCollection() {
  const client = await _client
  return client.db('chat').collection('chats')
}

// Using routes
app.ws.use(
  route.all('/ws', async (ctx) => {
    const chatsCollection = await getChatsCollection()
    const chatsCursor = chatsCollection.find({}, { sort: { createAt: 1 } })

    const chats = await chatsCursor.toArray()
    ctx.websocket.send(
      JSON.stringify({
        type: 'sync',
        payload: {
          chats,
        },
      })
    )
    ctx.websocket.on('message', async (data) => {
      if (typeof data !== 'string') {
        return
      }

      /**
       * @type {Chat}
       */
      const chat = JSON.parse(data)

      await chatsCollection.insertOne({
        ...chat,
        createdAt: new Date(),
      })

      const { message, nickname } = chat

      const { server } = app.ws

      if (!server) {
        return
      }

      server.clients.forEach((client) => {
        client.send(
          JSON.stringify({
            type: 'chat',
            payload: {
              message,
              nickname,
            },
          })
        )
      })
    })
  })
)

app.listen(5000)
