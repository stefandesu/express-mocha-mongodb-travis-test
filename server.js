const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

const
  mongoHost = process.env.MONGO_HOST || "localhost",
  mongoPort = process.env.MONGO_PORT || 27017,
  mongoDb = process.env.MONGO_DB || "express-mocha-mongodb-travis-test",
  mongoUrl = `mongodb://${mongoHost}:${mongoPort}/${mongoDb}`,
  mongoOptions = { useNewUrlParser: true }

const db = MongoClient.connect(mongoUrl, mongoOptions).then(db => {
  return db
}).catch(error => {
  throw error
})

module.exports = {
  db
}
