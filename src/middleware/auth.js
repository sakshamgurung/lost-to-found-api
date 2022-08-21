function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.send({ isAuth: false }).status(403);
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.send({ isAuth: true }).status(200);
	}
	next();
}

module.exports = { checkAuthenticated, checkNotAuthenticated };
