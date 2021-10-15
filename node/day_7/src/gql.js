// @ts-check

const { ApolloServer, gql } = require('apollo-server')
const { sequelize, User, City } = require('./main')

const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    age: Int!
    city: City
  }

  type City {
    id: Int!
    name: String!
    users: [User]
  }

  type Query {
    users: [User]
    cities: [City]
  }
`

const resolvers = {
  Query: {
    users: () => User.findAll(),
    cities: () => City.findAll(),
  },

  User: {
    city: async (user) => {
      console.log(user)

      return City.findOne({
        where: {
          id: user.cityId,
        },
      })
    },
  },

  City: {
    users: async (city) =>
      User.findAll({
        where: {
          cityId: city.id,
        },
      }),
  },
}

async function main() {
  await sequelize.sync({ force: true })

  const seoul = await City.build({
    name: 'seoul',
  }).save()

  await User.build({
    name: 'Coco',
    age: 24,
    cityId: seoul.getDataValue('id'),
  }).save()

  await User.build({
    name: 'Eoeo',
    age: 30,
    cityId: seoul.getDataValue('id'),
  }).save()

  const server = new ApolloServer({ typeDefs, resolvers })

  server.listen(5000).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`)
  })
}

main()
