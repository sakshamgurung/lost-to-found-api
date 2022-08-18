const express = require("express");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");

const config = require("./config");
const passportInit = require("./config/passport-config");
const accountRouter = require("./src/account/router");

const app = express();
const apiVersion = "/api";

passportInit.init(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
	session({
		secret: config.sessionSecret,
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use(apiVersion, accountRouter);

app.listen(config.port, () => {
	console.log(`Server running at PORT:${config.port}`);
});
