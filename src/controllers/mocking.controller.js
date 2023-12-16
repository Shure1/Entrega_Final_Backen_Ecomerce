import { randomProductsFaker } from "../utils/fakerProducts";

export const getFakerproducts = async (req, res) => {
  try {
    const fakeProducts = await randomProductsFaker(100);
    res.status(200).send({ response: "ok", message: fakeProducts });
  } catch (error) {
    res
      .status(500)
      .send({
        responde: "error",
        message: "Error trying to create Faker Products",
      });
  }
};
