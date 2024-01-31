import { __dirname } from "../path.js";
import multer from "multer";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		try {
			let folderName = "";
			console.log(__dirname);
			/* console.log(`desde el upleader el type es ${req.body}`); */
			switch (req.body.type) {
				case "profile":
					folderName = `${__dirname}/public/img/profile`;
					break;
				case "product":
					folderName = `${__dirname}/public/img/product`;
					break;
				case "document":
					folderName = `${__dirname}/public/img/documents`;
					break;
				default:
					break;
			}
			cb(null, folderName);
			console.log("ruta del archivo para guardar:", folderName);
		} catch (e) {
			console.log("error en cargar la imagen", e);
		}
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const uploader = multer({ storage });

export default uploader;
