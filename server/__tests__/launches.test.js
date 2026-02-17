const request = require("supertest");
const app = require("../src/app");
const { mongoConnect, mongoDisconnect } = require("../src/services/mongo");
const { loadPlanetsData } = require("../src/models/planets.model");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /v1/launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /launch", () => {
    const completeLaunchData = {
      mission: "USR Enterpriser",
      rocket: "NCZ F2-3C",
      target: "Kepler-62 f",
      launchDate: "March 12, 2034",
    };

    const launchDataWithoutDate = {
      mission: "USR Enterpriser",
      rocket: "NCZ F2-3C",
      target: "Kepler-62 f",
    };

    const lanchDataWithInvalidDate = {
      mission: "USR Enterpriser",
      rocket: "NCZ F2-3C",
      target: "Kepler-62 f",
      launchDate: "asdf",
    };

    test("It shouls rspond with 201 success", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .set("Content-Type", "application/json")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("it should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(lanchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
