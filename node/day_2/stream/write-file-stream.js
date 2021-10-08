// @ts-check

// 스트림으로 큰 파일 처리하기

// aaaaaaaabbbbbbbbaaaabbbbbaaabbb......aaaabbbbb
// 위와 같은 파일에서 , a의 연속구간(a block)의 개수와 b의 연속 구간(b block)의 개수를 세는 프로그램

const fs = require('fs')

const ws = fs.createWriteStream(`${__dirname}/big-file`)

const NUM_BLOCKS = 500

/**
 * @type {Object.<string, number>}
 */
const numBlockPerCharacter = {
  a: 0,
  b: 0,
}

for (let i = 0; i < NUM_BLOCKS; i += 1) {
  const blockLength = Math.floor(800 + Math.random() * 200)
  const character = i % 2 === 0 ? 'a' : 'b'
  ws.write(character.repeat(1024 * blockLength))

  numBlockPerCharacter[character] += 1
}

console.log(numBlockPerCharacter)
