// @ts-check

const express = require('express')
const userRouter = require('./routers/user')
const axios = require('axios')
const session = require('express-session')
const app = express()
app.use(express.json())
app.use('/public', express.static('src/public'))
app.use('/uploads', express.static('uploads'))

app.set('views', 'src/views')
app.set('view engine', 'pug')

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'cookiesecret',
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
)

app.use('/users', userRouter)
app.use('/', async (req, res) => {
  try {
    console.log('hi')
    if (!req.session.jwt) {
      //@ts-ignore
      const tokenResult = await axios.post('http://localhost:3085/v1/token', {
        clientSecret: '1f34d111-000f-4fe6-a874-2f59b7c1695e',
      })
      console.log(tokenResult.data)
      if (tokenResult.data && tokenResult.data.code === 200) {
        //@ts-ignore
        req.session.jwt = tokenResult
      } else {
        return res.json(tokenResult.data)
      }
    }

    // res.render('index', {
    //   message: 'Hello, Pug!!',
    // })
  } catch (err) {
    console.error(err)
  }
})

// @ts-ignore
app.use((err, req, res, next) => {
  res.statusCode = err.statusCode || 500
  res.send(err.message)
})

module.exports = app
