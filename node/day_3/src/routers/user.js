const express = require('express')
const router = express.Router()
const multer = require('multer')

const upload = multer({ dest: 'uploads/' })

const USERS = {
  15: {
    nickname: 'foo',
    profileImageKey: undefined,
  },
  16: {
    nickname: 'Bark',
    profileImageKey: undefined,
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
      userId: req.params.id,
      // profileImageURL: '/uploads/7b19b1b2b921ce084860faa15213e5a8',
      profileImageURL: `/uploads/${req.user.profileImageKey}`,
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

router.post('/:id/profile', upload.single('profile'), (req, res, next) => {
  const { user } = req
  const { filename } = req.file

  user.profileImageKey = req.file.filename
  // user.profileImage

  console.log(req.file)

  res.send(`User profile image uploaded: ${filename}`)
})

module.exports = router
