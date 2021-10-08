// @ts-check
/*
const fs = require('fs')

const result = fs.readFileSync('buffer/test')

console.log(result)
*/

// 1byte = 8bit 0 이상 255 이하의 값 0~2^8-1

// buffer compare
/*
const buf = Buffer.from([97, 98, 99, 100, 102])

const bufA = Buffer.from([0])
const bufB = Buffer.from([3])
const bufC = Buffer.from([2])
const bufD = Buffer.from([6])

const bufs = [bufA, bufB, bufC, bufD]
// bufs.sort((a, b) => a.compare(b))
bufs.sort(Buffer.compare)
console.log(bufs)
*/

// Buffer isBuffer
/*
const isBuffer = Buffer.from([0, 1, 2, 3])

console.log(Buffer.isBuffer(isBuffer))
*/

/**
 * LE vs BE
 * LE : Little Endian - 앞을 제일 작은 자릿수로 본다.
 * BE : Big Endian - 뒤를 제일 작은 자릿수로 본다.
 */

const buf = Buffer.from([20, 23, 1, 5])

/**
 * @param {*} array
 * @returns {number}
 */
function readInt32LE(array) {
  return array[0] + array[1] * 256 + array[2] * 256 ** 2 + array[3] * 256 ** 3
}
/**
 * @param {*} array
 * @returns {number}
 */
function readInt32BE(array) {
  return array[3] + array[2] * 256 + array[1] * 256 ** 2 + array[0] * 256 ** 3
}

const { log } = console

log(readInt32LE(buf))
log(buf.readInt32LE())
log(readInt32BE(buf))
log(buf.readInt32BE())
