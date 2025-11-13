const request = require("supertest");
const app = require("../src/app");

describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Test POSt /launch", () => {
  const completeLaunchData = {
    mission: "USR Enterprise",
    rocket: "NCZ F2-3C",
    target: "kepler-186 f",
    launchDate: "July 4, 2034",
  };

  const launchDataWithoutDate = {
    mission: "USR Enterprise",
    rocket: "NCZ F2-3C",
    target: "kepler-186 f",
  };

  const lanchDataWithInvalidDate = {
    mission: "USR Enterprise",
    rocket: "NCZ F2-3C",
    target: "kepler-186 f",
    launchDate: "asdf",
  };

  test("It shouls rspond with 201 success", async () => {
    const response = await request(app)
      .post("/launches")
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
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });

  test("it should catch invalid dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send(lanchDataWithInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Invalid launch date",
    });
  });
});
