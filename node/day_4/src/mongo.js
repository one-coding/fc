const { MongoClient } = require('mongodb')

const uri = `mongodb+srv://cnemo:cnemo060712!@cluster0.kqfvb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

module.exports = client
