import "dotenv/config";
import * as chai from "chai";
import mongoose from "mongoose";
import supertest from "supertest";

const expect = chai.expect;

//? SUPERTEST NOS SIRVE PARA PROBAR LAS RUTAS Y COMO SE INTEGRAN A LA APLICACION

const requester = supertest("http://localhost:4000");

await mongoose.connect(process.env.MONGO_URL);

describe("Test Crud de Productos en la ruta api/products", function () {
  it("ruta: api/products GET", async () => {
    const { statusCode, _body, ok } = await requester.get("/api/products");
    console.log(statusCode);
    console.log(_body);
    console.log(ok);
    expect(ok).to.be.ok;
  });
  it("ruta: api/products GET", async () => {
    const id = "6504fab64d5e497ca8ec2fb4";
    const { statusCode, _body, ok } = await requester.get(
      `/api/products/${id}`
    );
    console.log(statusCode);
    console.log(_body);
    console.log(ok);
    expect(statusCode).to.be.equal(200);
  });

  it("ruta: api/products POST", async () => {
    const newProduct = {
      title: "chocolate",
      description: "chocolate de cacao",
      stock: 2,
      code: "D3KIDS2",
      price: 65,
      category: "chocolate",
    };

    /* hacemos el test con los parametros esperados enviandole un producto de ej */
    const { statusCode, _body, ok } = await requester
      .post("/api/products")
      .send(newProduct);
    expect(statusCode).to.be.equal(201);
    /* otra manera de verlo es 
    expect(_body.respuesta).to.be.equal('OK') */
    console.log(statusCode);
    console.log(_body);
    console.log(ok);
  });
  it("ruta: api/products PUT", async () => {
    const id = "64ffda2fe68f421a1319fd8f";
    const updateProduct = {
      title: "queso azul",
      description: "queso",
      stock: 43,
      code: "SFS32K",
      price: 76,
      category: "quesos",
    };
    const { statusCode, _body, ok } = await requester
      .put(`/api/products/${id}`)
      .send(updateProduct);

    expect(statusCode).to.be.equal(200);
  });
  it("ruta: api/products DELETE", async () => {
    const id = "64ffda2fe68f421a1319fd8f";

    const { statusCode, _body, ok } = await requester.delete(
      `/api/products/${id}`
    );

    expect(statusCode).to.be.equal(200);
  });
});
