// @ts-check

const userRouter = require('./routers/user')
const session = require('express-session')
const axios = require('axios')
const express = require('express')

const app = express()

const URL = 'http://localhost:3085/v1'

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

const apiRequest = async (req) => {
  try {
    if (!req.session.jwt) {
      // 세션에 토큰이 없으면
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: '1f34d111-000f-4fe6-a874-2f59b7c1695e',
      })
      req.session.jwt = tokenResult.data.token // 세션에 토큰 저장
    }
    return await axios.post(
      `${URL}/customer`,
      {
        name: 'jwt',
        phone: '01194240151',
      },
      {
        headers: { authorization: req.session.jwt },
      }
    ) // API 요청
  } catch (error) {
    if (error.response.status === 419) {
      // 토큰 만료시 토큰 재발급 받기
      delete req.session.jwt
      return apiRequest(req)
    } // 419 외의 다른 에러면
    return error.response
  }
}

app.use('/', async (req, res, next) => {
  try {
    await apiRequest(req)
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
