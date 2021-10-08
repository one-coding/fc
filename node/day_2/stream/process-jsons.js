// @ts-check

const { log } = console

const fs = require('fs')

const rs = fs.createReadStream(`${__dirname}/local/jsons`, {
  encoding: 'utf-8',
  highWaterMark: 6,
})

/** @type {number} */
let totalSum = 0

let acuumulatedJsonStr = ''
rs.on('data', (chunk) => {
  log('Event: chunk')

  if (typeof chunk !== 'string') {
    return
  }

  acuumulatedJsonStr += chunk
  const lastNwelineIdx = acuumulatedJsonStr.lastIndexOf('\n')

  const jsonLinesStr = acuumulatedJsonStr.substring(0, lastNwelineIdx)
  acuumulatedJsonStr = acuumulatedJsonStr.substring(lastNwelineIdx)

  totalSum += jsonLinesStr
    .split('\n')
    .map((jsonLine) => {
      try {
        return JSON.parse(jsonLine)
      } catch {
        return undefined
      }
    })
    .filter((json) => json)
    .map((json) => json.data)
    .reduce((sum, current) => sum + current, 0)
})

rs.on('end', () => {
  log('Event: end')
  console.log(totalSum)
})
