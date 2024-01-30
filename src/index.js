import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import initializePassport from "./config/passport.js";

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

//Logger
import { addLogger } from "./config/logger.js";

//handlebars
import { engine } from "express-handlebars";

//socket io
import { Server } from "socket.io";

import { __dirname } from "./path.js";

import path from "path";

//modulo de rutas
import router from "./routes/index.routes.js";
import { error } from "console";

/* concedemos permisos que la URL se conecte al back */
const whitelist = ["http://localhost:5173"];

/* revisamos si esta en la lista, si no lo pateamo */
const corOptions = {
	origin: function (origin, callback) {
		/* si se encuentra una conexion o es local */
		if (whitelist.indexOf(origin) != -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("acceso denegado"));
		}
	},
};

const app = express();
const PORT = 4000;

const swaggerOptions = {
	definition: {
		openapi: "3.1.0",
		info: {
			title: "Documentacion del curso de Backend",
			description: "API Coder Backend",
		},
	},
	apis: [`${__dirname}/docs/**/*.yaml`], //** indica una subcarpeta que no me interesa el nombre, *.yaml no me interesa el nombre solo la extension
};

const specs = swaggerJSDoc(swaggerOptions);

//?MIDDLEWARES
app.use(addLogger);
app.use(express.json());
app.use(cors(corOptions));
app.use(express.urlencoded({ extended: true })); //para que podamos trabajar con querys largas
app.use(cookieParser(process.env.SIGNED_COOKIE)); // La cookie esta firmada

//?MIDLEWARES DE HANDLEBARS
app.engine("handlebars", engine()); //Defino que motor de plantillas voy a utilizar y su config
app.set("view engine", "handlebars"); //Setting de mi app de hbs
app.set("views", path.resolve(__dirname, "./views")); //Resolver rutas absolutas a traves de rutas relativas
app.use("/static", express.static(path.join(__dirname, "/public"))); //me evito el problema de la ruta en diferentes sist operativos u otros pc y sirve para ocupar la carpeta public para el handlebars

//?CONEXION A MONGODB
mongoose
	.connect(process.env.MONGO_URL)
	.then(async () => {
		console.log("BDD conectada");
		//Filtro -
		/* const resultado = await cartModel.findOne({
      _id: "64ffd7d6e68f421a1319fd8d",
    }); */

		/* const resultado = await productModel.paginate(
      { category: "fiambres" },
      { limit: 1, page: 1, sort: { price: "1" } }
    );
    console.log(JSON.stringify(resultado.docs)); */

		/* const resultados = await orderModel.aggregate([
            {
                $match: { size: 'medium' }
            },
            {
                $group: { _id: "$name", totalQuantity: { $sum: "$quantity" }, totalPrice: { $sum: "$price" } }
            },
            {
                $sort: { totalPrice: 1 } //-1 mayor a menor, 1 menor a mayor
            },
            {
                $group: { _id: 1, orders: { $push: "$$ROOT" } } //$$ROOT el array generado hasta el momento, digase las ordenes de ventas
            },
            {
                $project: { //Generar un nuevo proyecto para guardar en la bdd
                    "_id": 0, //Id autogenerado
                    orders: "$orders"
                }
            },
            {
                $merge: {
                    into: "reports" //Guardo en la coleccion reports en MongoDB Atlas
                }
            }
        ]) */
	})
	.catch(() => console.log("Error en conexion a BDD"));

//?GUARDAMOS LAS SESIONES EN MONGO
/* app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL, //es la url que usa useNewUrlParser
      mongoOptions: {
        useNewUrlParser: true, //establecemos conexion mediante url
        useUnifiedTopology: true, //manejo de clusters de manera dinamica, nos conectamos al controlador actual de base de datos
      },
      ttl: 60, //duracion de la sesion en la BDD en seg
    }),
    secret: process.env.SESSION_SECRET,
    //fuerzo a que intente guardar a pesar de no tener modificaciones en los datos
    resave: false,
    //fuerzo a que la sesion guarde un valor (id) al menos
    saveUninitialized: false,
  })
); */
//?USO DE PASSPORT APLICAMOS LA ESTRATEGIA Y MANEJAMOS LAS SESIONES
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//?RUTAS
app.use("/", router);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.listen(PORT, () => {
	console.log(`Server on Port ${PORT}`);
});
