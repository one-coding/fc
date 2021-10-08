// @ts-check

// CommonJs : require
// ECMAScript : export, import

// - node standard library에 있는 모듈은 절대경로를 지정해 가져온다.
// - 이 프로젝트 내의 다른 파일은 상대경로를 지정해 가져온다.
// - 절대 경로를 지정하면 module.paths의 경로 중 하나에서 해당 모듈이 있는 지 검사해 가져온다.
//    => 가장 가까운 곳에 있는 node_modules 안에 있는 파일을 require한다.

// fs
const fs = require('fs')

const FILENAMWE = 'src/main.jsx'

// callback-style

fs.readFile(FILENAMWE, 'utf-8', (err, result) => {
  if (err) {
    console.error(err)
  } else {
    console.log(result)
  }
})

// sync-style

try {
  const result = fs.readFileSync(FILENAMWE, 'utf-8')
  console.log(result)
} catch (err) {
  console.error(err)
}

// promise-style
async function main() {
  try {
    const result = await fs.promises.readFile(FILENAMWE, 'utf-8')
    console.log(result)
  } catch (err) {
    console.error(err)
  }
}
main()
