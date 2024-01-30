import { __dirname } from "../path.js";
import multer from "multer";

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		let folderName = "";
		switch (req.body.type) {
			case "profile":
				folderName = `${__dirname}/../public/img/profile`;
				break;
			case "product":
				folderName = `${__dirname}/../public/img/product`;
				break;
			case "document":
				folderName = `${__dirname}/../public/documents`;
				break;
			default:
				break;
		}
		cb(null, folderName);
	},
	filename: function (req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

const uploader = multer({ storage });

export default uploader;
