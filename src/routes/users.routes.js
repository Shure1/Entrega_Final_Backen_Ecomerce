import { Router } from "express";
import { userModel } from "../models/users.models.js";
import { sendRecoveryMail } from "../config/nodemailer.js";
import crypto from "crypto";
import uploader from "../utils/uploader.js";
import { createHash } from "../utils/bcrypt.js";

const userRouter = Router();
const recoveryLinks = {};

userRouter.get("/", async (req, res) => {
	try {
		const users = await userModel.find();
		res.status(200).send({ respuesta: "OK", mensaje: users });
	} catch (error) {
		res
			.status(400)
			.send({ respuesta: "Error en consultar usuarios", mensaje: error });
	}
});

userRouter.get("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const user = await userModel.findById(id);
		if (user) {
			res.status(200).send({ respuesta: "OK", mensaje: user });
		} else {
			res.status(404).send({
				respuesta: "Error en consultar usuario",
				mensaje: "User not Found",
			});
		}
	} catch (error) {
		res
			.status(400)
			.send({ respuesta: "Error en consultar usuario", mensaje: error });
	}
});

/* userRouter.post("/", async (req, res) => {
  const { first_name, last_name, age, email, password } = req.body;
  try {
    const respuesta = await userModel.create({
      first_name,
      last_name,
      age,
      email,
      password,
    });
    res.status(200).send({ respuesta: "OK", mensaje: respuesta });
  } catch (error) {
    res
      .status(400)
      .send({ respuesta: "Error en crear usuario", mensaje: error });
  }
}); */

userRouter.put("/:id", async (req, res) => {
	const { id } = req.params;
	const { first_name, last_name, age, email, password } = req.body;
	try {
		const user = await userModel.findByIdAndUpdate(id, {
			first_name,
			last_name,
			age,
			email,
			password,
		});
		if (user) {
			res.status(200).send({ respuesta: "OK", mensaje: user });
		} else {
			res.status(404).send({
				respuesta: "Error en actualizar usuario",
				mensaje: "User not Found",
			});
		}
	} catch (error) {
		res
			.status(400)
			.send({ respuesta: "Error en actualizar usuario", mensaje: error });
	}
});

userRouter.delete("/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const user = await userModel.findByIdAndDelete(id);
		if (user) {
			res.status(200).send({ respuesta: "OK", mensaje: user });
		} else {
			res.status(404).send({
				respuesta: "Error en eliminar usuario",
				mensaje: "User not Found",
			});
		}
	} catch (error) {
		res
			.status(400)
			.send({ respuesta: "Error en eliminar usuario", mensaje: error });
	}
});

userRouter.post("/password-recovery", (req, res) => {
	//enviamos el email
	const { email } = req.body;
	try {
		//token unico con el fin de que no hayan dos usuarios con el mismo link de recuperacion
		const token = crypto.randomBytes(20).toString("hex");

		/* instanciamos esto para hacer que el token dure 1 hora */
		recoveryLinks[token] = { email: email, timestamp: Date.now() };

		/* generamos el link donde sera redireccionado el user */
		const recoverylink = `http://localhost:4000/api/users/reset-password/${token}`;

		/* enviamos el mail con el link */
		sendRecoveryMail(email, recoverylink);

		res.status(200).send("Correo de recuperacion enviado");
	} catch (error) {
		res.status(500).send(`Error al enviar el mail ${error}`);
	}
});

userRouter.post("/reset-password/:token", async (req, res) => {
	const { token } = req.params;
	const { newPassword, newPassword2 } = req.body;

	try {
		/* obtenemos la informacion del email y desde cuando se aplico el tiempo de duracion */
		const linkData = recoveryLinks[token];
		if (linkData && Date.now() - linkData.timestamp <= 3600000) {
			const { email } = linkData;
			if (newPassword == newPassword2) {
				const passwordHash = createHash(newPassword);
				//modificar el usuario con la nueva contraseña
				const user = await userModel.findOneAndUpdate(
					{ email: email },
					{ password: passwordHash }
				);

				delete recoveryLinks[token];
				res.status(200).send("Contraseña modificada correctamente");
			} else {
				res.status(400).send("las contraseñas deben ser identicas");
			}
		} else {
			res.status(400).send("token invalido o expirado, pruebe nuevamente");
		}
	} catch (error) {}
});

userRouter.post(
	"/:uid/documents",
	uploader.array("documents"),
	async (req, res) => {
		const { uid } = req.params;
		const files = req.files;

		/* creamos un objeto para agregarlo a la bdd como rutas */
		for (const file of files) {
			const document = {
				name: file.originalname,
				reference: `/uploads/${req.body.type}/${file.filename}`,
			};

			// Busca al usuario en la base de datos
			const user = await userModel.findById(uid);

			// Agrega el nuevo documento a la propiedad documents del usuario
			user.documents.push(document);

			// Guarda el usuario en la base de datos
			await user.save();
		}

		res
			.status(200)
			.send({ respuesta: "OK", mensaje: "Archivos subidos correctamente" });
	}
);

export default userRouter;
