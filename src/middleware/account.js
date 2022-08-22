const account = require("../account/account");

function checkAccountNotExists(req, res, next) {
	const { email } = req.body;
	account
		.getAccountByEmail(email)
		.then((acc) => {
			if (acc != null) {
				return res.send({ accountExists: true, message: "Account already exists" }).status(400);
			}
		})
		.catch((error) => {
			console.log("Account not exists: ", error);
			next();
		});
}

function checkAccountExists(req, res, next) {
	const { email } = req.body;
	account.getAccountByEmail(email).then((acc) => {
		if (acc != null) {
			return next();
		}
		res.send({ accountExists: false, message: "Account doesn't exists" }).status(404);
	});
}

module.exports = { checkAccountExists, checkAccountNotExists };
