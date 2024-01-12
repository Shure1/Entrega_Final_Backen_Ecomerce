import * as chai from "chai";
import "dotenv/config";
import mongoose from "mongoose";
import { userModel } from "../src/models/users.models.js";
import { beforeEach } from "mocha";

//TODO deep nos sirve para realizar evaluaciones profundas o esperamos un valor en especifico

//?MOCHA NOS AYUDA A TESTEAR LOS MODELOS LO APLICAREMOS A USERS COMO EJEMPLO

const expect = chai.expect;

await mongoose.connect(process.env.MONGO_URL);

/* ahora aplicaremos chai en vez de assert para optimizar los test */

describe("Test CRUD Users con chai en api/users", function () {
  it("Obtener todos los usuarios mediante el metodo GET", async () => {
    const users = await userModel.find();

    /* si el array es verdadero entonces pasa el test */
    /*  expect(Array.isArray(users)).to.be.ok; */

    //? otra forma de verlo es si users termina devolviendo un []
    //expect(users).deep.equal([]); si es que esperamos un array vacio

    //?aqui nos aseguramos que retorne un array pero que no este vacio (que tenga users)
    expect(users).not.to.be.deep.equal([]);
  });

  it("obtener un usuario mediante metodo GET", async () => {
    const user = await userModel.findById("653ebc6486fa764a4c4ab81e");

    //?nos aseguramos que el user tenga la propiedad _id
    expect(user).to.have.property("_id");
  });

  it("crear un usuario mediante metodo POST", async () => {
    const newUser = {
      first_name: "daniela",
      last_name: "perez",
      age: 43,
      email: "daniela2132@gmail.com",
      password: '#SDRE"#ewewe3$#',
    };

    const user = await userModel.create(newUser);

    /* verificamos si el usuario tiene el atributo id */
    expect(user).to.have.property("_id");
  });

  it("Actualizar un usuario mediante metodo PUT", async () => {
    const updateUser = {
      first_name: "daniela",
      last_name: "contreras",
      age: 58,
      email: "daniela2132@gmail.com",
      password: '#SDRE"#ewewe3$#',
    };

    /* actualizamos el user */
    const user = await userModel.findByIdAndUpdate(
      "65984ed5bd4351a4b476bdee",
      updateUser
    );

    /* verificamos si el usuario tiene el atributo id, si es que lo tiene es porque fue paso el update */
    expect(user).to.have.property("_id");
  });

  it("Eliminar un usuario mediante metodo DELETE", async () => {
    const resultado = await userModel.findByIdAndDelete(
      "659820e72e191e0a6a1cd56b"
    );

    //?si no se elimina (resultado) no tira error pero si se elimina deberia estar todo ok
    expect(resultado).to.be.ok;
  });
});

/* 65984ed5bd4351a4b476bdee */
