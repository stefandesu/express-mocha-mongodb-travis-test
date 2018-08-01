const express = require("express")
const app = express()
const bodyParser = require("body-parser")

const MongoClient = require("mongodb").MongoClient
const ObjectID = require('mongodb').ObjectID
require("dotenv").config()

const
  port = process.env.PORT || 3100,
  mongoHost = process.env.MONGO_HOST || "localhost",
  mongoPort = process.env.MONGO_PORT || 27017,
  mongoDb = process.env.MONGO_DB || "express-mocha-mongodb-travis-test",
  mongoUrl = `mongodb://${mongoHost}:${mongoPort}`,
  mongoOptions = { useNewUrlParser: true }

// Promise for MongoDB db
const db = MongoClient.connect(mongoUrl, mongoOptions).then(client => {
  return client.db(mongoDb)
}).catch(error => {
  throw error
})

db.then(db => {
  const collection = db.collection("things")

  // Prepare express with body-parser
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.text())
  app.use(bodyParser.json({ type: "application/json" }))

  app.get("/", (req, res) => res.json({ message: "Welcome!" }))

  app.route("/thing")
    .get((req, res, next) => {
      // Return all things
      collection.find({}).toArray().then(things => {
        res.json(things)
      }).catch(next)
    })
    .post((req, res, next) => {
      let thing = req.body
      collection.insert(thing).then(result => {
        res.json({
          message: "Book successfully added!",
          thing: result.ops[0]
        })
      }).catch(next)
    })

  app.route("/thing/:id")
    .get((req, res, next) => {
      let objectId
      try {
        objectId = new ObjectID(req.params.id)
      } catch(error) {
        next(new Error("Invalid object ID."))
        return
      }
      collection.findOne({ _id: objectId }).then(thing => {
        if (!thing) {
          next(new Error("Could not find object ID."))
          return
        }
        res.json(thing)
      }).catch(next)
    })
    .delete((req, res, next) => {
      let objectId
      try {
        objectId = new ObjectID(req.params.id)
      } catch(error) {
        next(new Error("Invalid object ID."))
        return
      }
      collection.deleteOne({ _id: objectId }).then(({ result }) => {
        if (result.n == 1) {
          res.json({
            message: "Thing successfully deleted.",
            result
          })
        } else {
          next(new Error("Could not delete thing."))
        }
      }).catch(next)
    })

  app.listen(port, () => {
    console.log("Express server running on port", port)
  })
})

module.exports = {
  db
}
