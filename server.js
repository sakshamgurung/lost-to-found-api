const express = require("express");
const methodOverride = require("method-override");
const cors = require("cors");
const flash = require("express-flash");

const config = require("./config");
const accountRouter = require("./src/account/router");
const submissionRouter = require("./src/submission/router");

const app = express();
const apiVersion = "/api";

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(methodOverride("_method"));
app.use(cors());

app.use(apiVersion, accountRouter);
app.use(apiVersion, submissionRouter);

app.listen(config.port, () => {
	console.log(`Server running at PORT:${config.port}`);
});
