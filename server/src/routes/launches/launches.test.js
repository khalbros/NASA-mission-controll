const request = require("supertest")
const {mongoConnect, mongoDisconnect} = require("../../../services/mongo")
const app = require("../../app")
const {loadPlanets} = require("../../models/planets.model")

describe("Launch API", () => {
  beforeAll(async () => {
    await mongoConnect()
    await loadPlanets()
  })
  afterAll(async () => {
    await mongoDisconnect()
  })

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200)
    })
  })

  describe("Test POST /launches", () => {
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-442 b",
      launchDate: "January 4, 2029",
    }
    const lauchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-442 b",
    }

    test("It should respond with 201 created", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201)

      const requestDate = new Date(completeLaunchData.launchDate).valueOf()
      const responseDate = new Date(response.body.launchDate).valueOf()
      expect(responseDate).toBe(requestDate)

      expect(response.body).toMatchObject(lauchDataWithoutDate)
    })
    test("It should catch missing required properties", () => {})
    test("It should catch invalid dates", () => {})
  })
})
