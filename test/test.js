const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")
chai.use(chaiAsPromised)
const should = chai.should()
const server = require("../server")

// Hide UnhandledPromiseRejectionWarning on output
process.on('unhandledRejection', () => {})

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
