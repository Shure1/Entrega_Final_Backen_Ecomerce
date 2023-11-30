import { productModel } from "../models/products.models.js";

export const getProducts = async (req, res) => {
  let { limit, page, sort, category, status } = req.query;
  limit = parseInt(limit) || 10;
  page = parseInt(page) || 1;
  console.log("llego a products api");

  try {
    let paramsPaginate = {
      limit,
      page,
      sort,
    };
    let consultaQuery = {
      ...(category && { category }),
      ...(status && { status }),
    };
    if (sort) {
      sort === "asc"
        ? (paramsPaginate.sort = { price: 1 })
        : (paramsPaginate.sort = { price: -1 });
    }
    console.log(consultaQuery);

    const prods = await productModel.paginate(consultaQuery, paramsPaginate);
    if (prods) {
      return res.status(200).send(prods);
    }
    res.status(404).send({ error: "productos no encontrados" });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en consultar productos", mensaje: error });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const prod = await productModel.findById(id);
    if (prod) res.status(200).send({ respuesta: "OK", mensaje: prod });
    else
      res.status(404).send({
        respuesta: "Error en consultar Producto",
        mensaje: "Not Found",
      });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en consulta producto", mensaje: error });
  }
};

export const postProduct = async (req, res) => {
  const { title, description, stock, code, price, category } = req.body;
  try {
    const prod = await productModel.create({
      title,
      description,
      stock,
      code,
      price,
      category,
    });
    if (prod) {
      res.status(201).send({ respuesta: "OK", mensaje: prod });
    }
    res
      .status(400)
      .send({ respuesta: "producto ya estaba creado", mensaje: error });
  } catch (error) {
    if (error.code == 11000) {
      //error de llave duplicada en mongoose
      return res
        .status(400)
        .send({ error: "producto ya creado llave duplicada" }); //puede suceder cuando se crear un producto con el mismo codigo
    }
    res
      .status(500)
      .send({ respuesta: "Error en crear productos", mensaje: error });
  }
};

export const putProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, stock, status, code, price, category } = req.body;

  try {
    const prod = await productModel.findByIdAndUpdate(id, {
      title,
      description,
      stock,
      status,
      code,
      price,
      category,
    });
    if (prod)
      res
        .status(200)
        .send({ respuesta: "OK", mensaje: "Producto actualizado" });
    else
      res.status(404).send({
        respuesta: "Error en actualizar Producto",
        mensaje: "Not Found",
      });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en actualizar producto", mensaje: error });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const prod = await productModel.findByIdAndDelete(id);
    if (prod)
      res.status(200).send({ respuesta: "OK", mensaje: "Producto eliminado" });
    else
      res.status(404).send({
        respuesta: "Error en eliminar Producto",
        mensaje: "Not Found",
      });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en eliminar producto", mensaje: error });
  }
};
