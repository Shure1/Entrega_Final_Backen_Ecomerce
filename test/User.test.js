import "dotenv/config";
import mongoose from "mongoose";
import { userModel } from "../src/models/users.models.js";
import Assert from "assert";
import { beforeEach } from "mocha";

//?MOCHA NOS AYUDA A TESTEAR LOS MODELOS LO APLICAREMOS A USERS COMO EJEMPLO

const assert = Assert.strict;

await mongoose.connect(process.env.MONGO_URL);

describe("Test Crud de Usuarios en la ruta api/users", function () {
  /* previo  a comenzar todo el test */
  before(() => {
    console.log("antes del test");
  });
  /* previo a arrancar cada uno de los test */
  beforeEach(() => {
    console.log("comienza el test");
  });

  it("obtener todos los usuarios mediante el metodo GET", async () => {
    const users = await userModel.find();
    console.log(users);

    /* aunque no hayan users el test nos deberia entregar un array (aunque sea vacio) */
    assert.strictEqual(Array.isArray(users), true);
  });

  it("obtener un usuario mediante metodo GET", async () => {
    const user = await userModel.findById("653ebc6486fa764a4c4ab81e");

    /* verificamos si lo que retorna user es un objeto */
    assert.strictEqual(typeof user, "object");
    /* verificamos si el usuario tiene el atributo id */
    assert.ok(user._id);
  });

  it("crear un usuario mediante metodo POST", async () => {
    const newUser = {
      first_name: "martin",
      last_name: "gonzalez",
      age: 33,
      email: "martin@gmail.com",
      password: '#SDRE"#ewewe3$#',
    };

    const user = await userModel.create(newUser);

    /* verificamos si el usuario tiene el atributo id */
    assert.ok(user._id);
  });

  it("Actualizar un usuario mediante metodo PUT", async () => {
    const updateUser = {
      first_name: "roberto",
      last_name: "perez",
      age: 54,
      email: "roberto@gmail.com",
      password: '#SDRE"#ewewe3$#',
    };

    /* actualizamos el user */
    const user = await userModel.findByIdAndUpdate(
      "653ebc6486fa764a4c4ab81e",
      updateUser
    );
    console.log(user);

    /* verificamos si el usuario tiene el atributo id, si es que lo tiene es porque fue paso el update */
    assert.ok(user._id);
  });

  it("Eliminar un usuario mediante metodo DELETE", async () => {
    const resultado = await userModel.findByIdAndDelete(
      "6595f3f7bcfc47f1b86ba79d"
    );

    /* verificamos si el usuario tiene el atributo id */
    assert.strictEqual(typeof resultado, "object");
  });
});
