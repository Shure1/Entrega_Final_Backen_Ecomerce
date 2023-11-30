import { Router } from "express";
import {
  postProduct,
  getProduct,
  deleteProduct,
  getProducts,
  putProduct,
} from "../controllers/products.controller.js";
import { passportError, authorization } from "../utils/messageError.js";

const productRouter = Router();

productRouter.get("/", getProducts);
productRouter.get("/:id", getProduct);
productRouter.post(
  "/",
  passportError("jwt"),
  authorization("user"),
  postProduct
);

productRouter.put(
  "/:id",
  passportError("jwt"),
  authorization("Admin"),
  putProduct
);

productRouter.delete(
  "/:id",
  passportError("jwt"),
  authorization("Admin"),
  deleteProduct
);

export default productRouter;
