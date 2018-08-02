const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
const chaiHttp = require("chai-http")
chai.use(chaiHttp)
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const server = require("../server")

// Hide UnhandledPromiseRejectionWarning on output
process.on("unhandledRejection", () => {})

describe("Test", () => {
  it("1 == 1", () => {
    (1 == 1).should.be.true
  })
})

describe("MongoDB", () => {

  it("should connect to database successfully", () => {
    return server.db.should.be.fulfilled
  })

  after(() => {
    server.db.then(db => {
      db.close()
    }).catch(() => {})
  })
})

describe("Express Server", () => {

  let thing = {
    name: "A Test Thing"
  }

  beforeEach(done => {
    // Empty database before each test
    chai.request(server.app)
      .del("/thing")
      .end(() => {
        done()
      })
  })

  describe("GET /thing", () => {
    it("should GET all the things", done => {
      chai.request(server.app)
        .get("/thing")
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a("array")
          res.body.length.should.be.eql(0)
          done()
        })
    })
    it("should GET that one thing", done => {
      chai.request(server.app)
        .post("/thing")
        .send(thing)
        .end(() => {
          chai.request(server.app)
            .get("/thing")
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a("array")
              res.body.length.should.be.eql(1)
              done()
            })
        })
    })
  })

  describe("POST /thing", () => {
    it("should POST a thing", done => {
      chai.request(server.app)
        .post("/thing")
        .send(thing)
        .end((err, res) => {
          res.should.have.status(200)
          res.should.be.a("object")
          res.body.should.have.property("message").eql("Book successfully added!")
          res.body.should.have.property("thing")
          res.body.thing.should.have.property("name").eql(thing.name)
          done()
        })
    })
  })

  describe("GET /thing/:id", () => {
    it("should GET a thing by its id", done => {
      chai.request(server.app)
        .post("/thing")
        .send(thing)
        .end((err, res) => {
          res.body.should.have.property("message").eql("Book successfully added!")
          res.body.should.have.property("thing")
          let thing = res.body.thing
          chai.request(server.app)
            .get("/thing/" + thing._id)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a("object")
              res.body.should.have.property("name").eql(thing.name)
              done()
            })
        })
    })
  })

  describe("DELETE /thing/:id", () => {
    it("should DELETE a thing by its id", done => {
      chai.request(server.app)
        .post("/thing")
        .send(thing)
        .end((err, res) => {
          res.body.should.have.property("message").eql("Book successfully added!")
          res.body.should.have.property("thing")
          let thing = res.body.thing
          chai.request(server.app)
            .del("/thing/" + thing._id)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.be.a("object")
              res.body.should.have.property("message").eql("Thing successfully deleted.")
              done()
            })
        })
    })
  })

  describe("DELETE /thing", () => {
    it("should DELETE all the things", done => {
      chai.request(server.app)
        .del("/thing")
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a("object")
          res.body.should.have.property("message").eql("Things successfully deleted.")
          done()
        })
    })
  })

})
