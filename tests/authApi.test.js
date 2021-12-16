const app = require("../app");

const request = require("supertest");

const api = request(app);

const queryList = require("../database/queries").queryList;
const dbconnection = require("../database/connection");
describe("when user trying to login to the system", () => {
    test("It should response the GET method", async () => {
      const response = await api.get("/");
      expect(response.statusCode).toBe(200);
    });
  });