import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messageError.js";

import { login, register, logout } from "../controllers/session.controller.js";

const sessionRouter = Router();

sessionRouter.post("/login", passport.authenticate("login"), login);

sessionRouter.post("/register", passport.authenticate("register"), register);

sessionRouter.get("/logout", logout);

//el scope nos sirve para declarar que el user sera el email que ya esta registrado en github
sessionRouter.get(
	"/github",
	passport.authenticate("github", { scope: ["user:email"] }),
	async (req, res) => {
		res.status(200).send({ mensaje: "usuario registrado" });
	}
);

sessionRouter.get(
	"/githubCallback",
	passport.authenticate("github", { scope: ["user:email"] }),
	async (req, res) => {
		req.session.user = req.user;
		res.status(200).send({ mensaje: "usuario logeado" });
	}
);

//Verifica que el token enviado sea valido (misma contraseña de encriptacion)
/* sessionRouter.get(
  "/testJWT",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.send(req.user);
  }
); */

/* verificamos los permisos en el postman en esta ruta como parte de experimento */
sessionRouter.get(
	"/current",
	passportError("jwt"),
	authorization("Admin"),
	(req, res) => {
		res.send(req.user);
	}
);

export default sessionRouter;
