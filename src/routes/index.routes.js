import { Router } from "express";
import cartRouter from "./cart.routes.js";
import productRouter from "./products.routes.js";
import sessionRouter from "./session.routes.js";
import userRouter from "./users.routes.js";
import MockingRouter from "./mocking.routes.js";

const router = Router();

router.use("/api/users", userRouter);
router.use("/api/cart", cartRouter);
router.use("/api/products", productRouter);
router.use("/api/sessions", sessionRouter);
router.use("/api/mocking", MockingRouter);

export default router;
