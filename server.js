const express = require("express");
const methodOverride = require("method-override");
const cors = require("cors");
const flash = require("express-flash");
const fileUpload = require("express-fileupload");
const path = require("path");

const config = require("./config");
const { checkAuthenticated } = require("./src/middleware/auth");
const accountRouter = require("./src/account/router");
const submissionRouter = require("./src/submission/router");
const categoryRouter = require("./src/category/router");

const app = express();
const apiVersion = "/api";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(flash());
app.use(methodOverride("_method"));
app.use(cors());

app.post("/api/upload", checkAuthenticated, (req, res) => {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send("No files were uploaded.");
	}

	const imageUrl = [];

	if (Array.isArray(req.files["images[]"])) {
		req.files["images[]"].forEach((img) => {
			const imgName = new Date().getTime() + "_" + img.name;
			const imgPath = path.join(__dirname, "/upload/images/" + `${imgName}`);
			imageUrl.push(imgName);
			img.mv(imgPath, (err) => {
				if (err) {
					console.log("err", err);
					return res.status(500).send(err);
				}
			});
		});
	} else {
		const imgName = new Date().getTime() + "_" + req.files["images[]"].name;
		const imgPath = path.join(__dirname, "/upload/images/" + `${imgName}`);
		imageUrl.push(imgName);
		req.files["images[]"].mv(imgPath, (err) => {
			if (err) {
				console.log("err", err);
				return res.status(500).send(err);
			}
		});
	}

	res.status(200).send({ imageUrl });
});

app.use("/api/images", express.static("upload/images"));
app.use(apiVersion, accountRouter);
app.use(apiVersion, submissionRouter);
app.use(apiVersion, categoryRouter);

app.listen(config.port, () => {
	console.log(`Server running at PORT:${config.port}`);
});
