// @ts-check

/* 키워드를 검색해 나오는 원하는 사이즈로 이미지 리사이징 한 후 돌려주기 */

const fs = require('fs')
const path = require('path')
const http = require('http')
const { createApi } = require('unsplash-js')
const { default: fetch } = require('node-fetch')
const { pipeline } = require('stream')
const { promisify } = require('util')
const sharp = require('sharp')

const unsplash = createApi({
  accessKey: 'OHWlypSoxDUfO3D0dJiqK0Mrv7z8rtmjz0k3RtMhPhA',
  // @ts-ignore
  fetch,
})
/**
 *
 * @param {string} query
 */
async function searchImage(query) {
  const result = await unsplash.search.getPhotos({ query })

  if (!result.response) {
    throw new Error('Failed to search image.')
  }

  const image = result.response.results[0]

  if (!image) {
    throw new Error('No image found')
  }

  return {
    description: image.description || image.alt_description,
    url: image.urls.regular,
  }
}

/**
 * 이미지를 검색하거나 이미 있다면 캐시된 이미지를 리턴합니다
 * @param {string} query
 */
async function getCachedImageOrSearchedImage(query) {
  const imageFilePath = path.resolve(__dirname, `../images/${query}`)
  // const stat = fs.promises.stat(imageFilePath)
  if (fs.existsSync(imageFilePath)) {
    return {
      message: `Returning cached image: ${query}`,
      stream: fs.createReadStream(imageFilePath),
    }
  }

  const result = await searchImage(query)
  const resp = await fetch(result.url)

  await promisify(pipeline)(resp.body, fs.createWriteStream(imageFilePath))

  return {
    message: `Returning New Image: ${query}`,
    stream: fs.createReadStream(imageFilePath),
  }
}

/**
 *
 * @param {string} url
 */
function convertURLToImageInfo(url) {
  const urlObj = new URL(url, `http://localhost:5000`)
  const widthStr = urlObj.searchParams.get('width')
  const width = widthStr ? parseInt(widthStr, 10) : 400
  return { query: url.slice(1), width }
}

const server = http.createServer((req, res) => {
  async function main() {
    if (!req.url) {
      res.statusCode = 400
      res.end('Needs URL')
      return
    }

    const { query, width } = convertURLToImageInfo(req.url)
    try {
      const { message, stream } = await getCachedImageOrSearchedImage(query)

      console.log(message)
      await promisify(pipeline)(stream, sharp().resize(width).png(), res)
      stream.pipe(res)
    } catch (err) {
      res.statusCode = 400
      res.end()
    }
  }

  main()
})

const PORT = 5000

server.listen(PORT, () => {
  console.log(`${PORT}에서 waiting`)
})
