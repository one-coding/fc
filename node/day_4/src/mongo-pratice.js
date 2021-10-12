// @ts-check

const { MongoClient } = require('mongodb')

const uri = `mongodb+srv://cnemo:cnemo060712!@cluster0.kqfvb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function main() {
  try {
    await client.connect()

    const users = client.db('cnemo-test').collection('users')
    const cities = client.db('cnemo-test').collection('cities')

    // Reset
    await users.deleteMany({})
    await cities.deleteMany({})

    // init
    await cities.insertMany([
      { name: '서울', population: 1000 },
      { name: '부산', population: 350 },
    ])
    await users.insertMany([
      {
        name: 'Foo',
        birthYear: 2000,
        contacts: [
          { type: 'phone', number: '+821000001111' },
          {
            type: 'home',
            number: '+82023334444',
          },
        ],
        city: '서울',
      },
      {
        name: 'Bar',
        birthYear: 1995,
        contacts: [
          { type: 'phone', number: '+821000001111' },
          {
            type: 'home',
            number: '+82023334444',
          },
        ],
        city: '부산',
      },

      { name: 'Baz', birthYear: 1990, city: '부산' },
      { name: 'Poo', birthYear: 1993, city: '서울' },
    ])

    // await users.deleteOne({
    //   name: 'Baz',
    // })

    // await users.updateMany(
    //   {
    //     name: 'baz',
    //   },
    //   {
    //     $set: {
    //       name: 'Boo',
    //     },
    //   }
    // )

    const cursor = users.aggregate([
      {
        $lookup: {
          from: 'cities',
          localField: 'city',
          foreignField: 'name',
          as: 'city_info',
        },
      },
      {
        $match: {
          $and: [
            {
              'city_info.population': {
                $gte: 500,
              },
            },
            {
              birthYear: {
                $gte: 1995,
              },
            },
          ],
        },
      },
      {
        $count: 'num_users',
      },
    ])

    // const cursor = users.find({
    //   'contacts.type': 'phone',
    // })
    await cursor.forEach(console.log)

    await client.close()
  } catch (err) {
    console.error(err)
  }
}

main()
