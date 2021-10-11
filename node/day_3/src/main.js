// @ts-check

const express = require('express')

const app = express()

const PORT = 5000

app.listen(PORT, () => {
  console.log(`The Express Server listening at ${PORT}`)
})
