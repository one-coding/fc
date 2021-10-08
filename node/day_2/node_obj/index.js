// @ts-check

// __dirname, __filename
/*
console.log('__dirname', __dirname)
console.log('__filename', __filename)
*/

/*
process.stdin.setEncoding('utf-8')
process.stdin.on('data', (data) => {
  console.log(data, data.length)
})

process.stdin.pipe(process.stdout)
*/

// 명령줄 인자를 넣어서 배열로 만듬
// console.log(process.argv)

// os
/*
const os = require('os')

console.log(
  ['arch', os.arch()],
  ['platform', os.platform()],
  ['cpus', os.cpus()]
)
*/

// dns
const dns = require('dns')

dns.lookup('google.com', (err, address, family) => {
  console.log('address %j family Ipv%s', address, family)
})

// path

const path = require('path')
const fs = require('fs')

const filePath = path.resolve(__dirname, './test.txt')
console.log('filePath', filePath)

const fileContent = fs.readFileSync(filePath, 'utf-8')
console.log(fileContent)
