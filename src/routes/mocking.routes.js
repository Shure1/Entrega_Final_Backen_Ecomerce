import { Router } from "express";
import { getFakerproducts } from "../controllers/mocking.controller.js";

const MockingRouter = Router();

MockingRouter.get("/mockingproducts", getFakerproducts);

export default MockingRouter;
