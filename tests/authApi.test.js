const app = require("../app");

const request = require("supertest");

const api = request(app);

const queryList = require("../database/queries").queryList;
const dbconnection = require("../database/connection");
const config = require("../util/config");

const helpers = require("./helpers");
const bcrypt = require("bcryptjs");
describe("when user trying to login to the system /login", () => {

  beforeEach(async () => {
      await dbconnection.dbQuery(queryList.DELETE_USERS_QUERY);
      
   const newUser = {
      email: "testuser@test.com",
      password : "test12345",
      username : "testuser"
  }

    const passwordHash = await bcrypt.hash(newUser.password, 12)
    await dbconnection.dbQuery(queryList.ADD_USER_QUERY,[newUser.username, passwordHash, newUser.email]);
  })

      test("It should response the token and the ID of the user", async () => {

      const response = 
      await api
      .post("/api/v1/login")
      .send({email : "testuser@test.com", password : "test12345"})
      expect(response.statusCode).toBe(200)
      expect(response.body.token).toBeDefined();
    });
    test("it should response wrong email", async () => {
      const response = 
      await api
      .post("/api/v1/login")
      .send({email : "testu@test.com", password : "test12345"})
      expect(response.statusCode).toBe(401)
    })
    test("it should response wrong password", async () => {
      const response = 
      await api
      .post("/api/v1/login")
      .send({email : "testuser@test.com", password : "test345"})
      expect(response.statusCode).toBe(401)
    })
  });

  describe("when there is initially one user at the db /signup" , () => {  
    beforeEach(async () => {
      await dbconnection.dbQuery(queryList.DELETE_USERS_QUERY);

      const newUser = {
      email: "testuser@test.com",
      password : "test12345",
      username : "testuser"
      }

      const passwordHash = await bcrypt.hash(newUser.password, 12)
      await dbconnection.dbQuery(queryList.ADD_USER_QUERY,[newUser.username, passwordHash, newUser.email]);
    })

    test("creation succeeds with a fresh username", async () => {
      const newUser = {
        username: 'root',
        email: 'Superuser@user.com',
        password: 'salainen',
      }

      await api
      .post('/api/v1/signup')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    })

    test('creation fails with proper statuscode and message if email already taken', async () => {
      const newUser = {
        email: "testuser@test.com",
        password : "test12345",
        username : "testuser"
      }
  
      const result = await api
        .post('/api/v1/signup')
        .send(newUser)
        .expect(403)
        .expect('Content-Type', /application\/json/)
  
      expect(result.body).toContain('Email already exists')

    })
  })