const express = require('express')
const router = express.Router()

const USERS = {
  15: {
    nickname: 'foo',
  },
  16: {
    nickname: 'Bark',
  },
}
router.get('/', async (req, res) => {
  res.send('User List')
})

router.param('id', async (req, res, next, value) => {
  try {
    const user = USERS[value]
    if (!user) {
      const err = new Error('User not found')
      err.statusCode = 404
      throw err
    }
    // @ts-ignore
    req.user = USERS[value]
    next()
  } catch (err) {
    next(err)
  }
})

//users/15
router.get('/:id', async (req, res) => {
  const resMimeType = req.accepts(['json', 'html'])

  if (resMimeType === 'json') {
    // @ts-ignore
    res.send(req.user)
  } else if (resMimeType === 'html') {
    res.render('user-profile', {
      // @ts-ignore
      nickname: req.user.nickname,
    })
  }
})

router.post('/', (req, res) => {
  // Register user
  res.send(`User Registered`)
})
router.post('/:id/nickname', (req, res) => {
  // req : {"nickname" :  "bar"}
  // @ts-ignore
  const { user } = req
  const { nickname } = req.body
  user.nickname = nickname
  res.send(`User nickname updated: ${nickname}`)
})

module.exports = router
