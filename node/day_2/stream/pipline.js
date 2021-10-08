// @ts-check

// const { log, error } = console
const fs = require('fs')
const stream = require('stream')
const zlib = require('zlib')
const util = require('util')

async function gzip() {
  return util.promisify(stream.pipeline)(
    fs.createReadStream(`${__dirname}/local/big-file`),
    zlib.createGzip(),
    fs.createWriteStream(`${__dirname}/local/big-file.gz`)
  )
}

async function gunzip() {
  return util.promisify(stream.pipeline)(
    fs.createReadStream(`${__dirname}/local/big-file.gz`),
    zlib.createGunzip(),
    fs.createWriteStream(`${__dirname}/local/big-file.unzipped`)
  )
}

async function main() {
  await gzip()
  await gunzip()
}

main()

//   (err) => {
//     if (err) {
//       error('Gzip failed', err)
//     } else {
//       log('Gzip Succeeeded')

//       stream.pipeline(

//         (_err) => {
//           if (_err) {
//             error('Gunzip failed', _err)
//           } else {
//             log('Gunzip Succeeeded')
//           }
//         }
//       )
//     }
//   }
// )
