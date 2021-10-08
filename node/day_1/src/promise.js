// @ts-check
/* eslint-disable no-new */
/* eslint-disable no-console */

new Promise((resolve, reject) => {
  console.log('Before timeOut')
  setTimeout(() => {
    resolve(Math.random())
    console.log('After resolve')
  }, 1000)
})
  .then((value) => {
    console.log('value', value)
  })
  .catch((err) => {
    console.error(err)
  })
