import { faker } from "@faker-js/faker";

const modelProductFaker = async () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productName(),
    price: faker.commerce.price(),
    stock: faker.number.int({ max: 50 }),
    category: faker.commerce.productAdjective(),
    status: faker.datatype.boolean(),
    code: faker.finance.creditCardNumber(),
    thumbnails: faker.image.avatar(),
  };
};

export const randomProductsFaker = async (cant) => {
  const products = [];

  for (let i = 0; i < cant; i++) {
    const product = await modelProductFaker();
    products.push(product);
  }
  return products;
};
