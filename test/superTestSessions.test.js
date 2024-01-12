import "dotenv/config";
import * as chai from "chai";
import mongoose from "mongoose";
import supertest from "supertest";

const requester = supertest("http://localhost:4000");
await mongoose.connect(process.env.MONGO_URL);

const expect = chai.expect;

describe("Test Users Sessions /api/sessions", function () {
  it("Ruta /api/sessions/register con metodo POST", async () => {
    const newUser = {
      first_name: "nicolas",
      last_name: "gomez",
      age: 24,
      email: "niclasgomez@gmail.com",
      password: 'KSJDFNLKS#"sad',
    };

    const { statusCode } = await requester
      .post("/api/sessions/register")
      .send(newUser);
    expect(statusCode).to.be.equal(200);
  });
  it("Ruta: api/session/login con metodo POST", async () => {
    const user = {
      email: "niclasgomez@gmail.com",
      password: 'KSJDFNLKS#"sad',
    };

    const resultado = await requester.post("/api/sessions/login").send(user);
    expect(resultado).to.have.status(200);
    expect(resultado.body).to.have.property("token");
  });
});
