import { generateToken } from "../utils/jwt.js";
import { userModel } from "../models/users.models.js";

export const login = async (req, res) => {
	try {
		/* si passport no me entrega un user */
		if (!req.user) {
			return res.status(401).send({ mensaje: "usuario invalido" });
		}

		//! si segimos con sesiones en bdd esto no se borra,si utilizamos JWT si ya que el proposito de usar jwt es no usar sesiones en base de datos
		/* generamos la sesion */
		/* req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    }; */
		console.log(req.user);

		/* generamos el token */
		const token = generateToken(req.user);
		/* generamos una cookie */
		/* res.cookie("jwtCookie", token, {
      maxAge: 43200000, //12hs en milisegundos
    }); */

		/* enviamos el token al front para que se haga una cookie */
		res.status(200).send({ token });
	} catch (error) {
		res.status(500).send({ mensaje: `error al iniciar sesion ${error}` });
	}
};

export const register = async (req, res) => {
	try {
		/* si passport no me entrega un user */
		if (!req.user) {
			return res.status(400).send({ mensaje: "usuario ya existente" });
		}

		res.status(200).send({ mensaje: "usuario registrado" });
	} catch (error) {
		res.status(500).send({ mensaje: `error al registrar usuario ${error}` });
	}
};

export const logout = async (req, res) => {
	await userModel.findOneAndUpdate(
		{ email: req.user.email },
		{ $set: { last_connection: new Date() } }
	);
	//!comentamos esta parte ya que no trabajamos con sesiones en bdd pero si fuera asi la descomentamos
	//  if (req.session.login) {
	/* si la sesion esta activa la eliminamos */
	// req.session.destroy();
	// }
	//eliminamos la cookie
	res.clearCookie("jwtCookie");
	res.status(200).send({ resultado: "usuario deslogeado" });
};
