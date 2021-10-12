// @ts-check

const express = require('express')
const userRouter = require('./routers/user')

const app = express()
app.use(express.json())
app.use('/public', express.static('src/public'))
app.use('/uploads', express.static('uploads'))

app.set('views', 'src/views')
app.set('view engine', 'pug')

app.use('/users', userRouter)
app.use('/', (req, res) => {
  res.render('index', {
    message: 'Hello, Pug!!',
  })
})

// @ts-ignore
app.use((err, req, res, next) => {
  res.statusCode = err.statusCode || 500
  res.send(err.message)
})

module.exports = app
