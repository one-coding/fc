// @ts-check

const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize({
  database: 'fc21',
  username: 'kimjaelin',
  password: 'mypass',
  dialect: 'postgres',
  host: 'localhost',
})

const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
)

const City = sequelize.define(
  'city',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
)

User.belongsTo(City)

// User.build({
//   name: 'Coco',
//   age: 20,
// }).save()

module.exports = {
  sequelize,
  User,
  City,
}
