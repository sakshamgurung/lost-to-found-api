const jwt = require("jsonwebtoken");
const config = require("../../config");
const verifyToken = require("../../util/verify").verifyToken;

function checkAuthenticated(req, res, next) {
	const header = req.headers["authorization"];

	if (typeof header == "undefined") {
		return res.send({ message: "No token. Authentication denied.", isAuth: false }).status(403);
	}

	const bearer = header.split(" ");
	const token = bearer[1];
	jwt.verify(token, config.jwtSecret, (error, authData) => {
		if (error) {
			res.send({ message: "Token not verified", isAuth: false }).status(403);
		} else {
			verifyToken(authData.entityId, token, res).then((verifyTokenRes) => {
				if (verifyTokenRes) {
					req.auth = { entityId: authData.entityId, email: authData.email };
					return next();
				} else {
					return res.send({ message: "Token not verified", isAuth: false }).status(403);
				}
			});
		}
	});
}

function checkNotAuthenticated(req, res, next) {
	const header = req.headers["authorization"];
	if (typeof header == "undefined") {
		return next();
	}

	const bearer = header.split(" ");
	const token = bearer[1];

	jwt.verify(token, config.jwtSecret, (error, authData) => {
		if (error) {
			return next();
		} else {
			verifyToken(authData.entityId, token, res).then((verifyTokenRes) => {
				if (!verifyTokenRes) {
					return next();
				} else {
					return res.send({ isAuth: true }).status(200);
				}
			});
		}
	});
}

module.exports = { checkAuthenticated, checkNotAuthenticated };
