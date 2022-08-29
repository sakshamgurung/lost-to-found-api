const account = require("../account/account");

function checkAccountNotExists(req, res, next) {
	const { email } = req.body;
	account
		.getAccountByEmail(email)
		.then((acc) => {
			if (acc != null) {
				res.status(400).send({ accountExists: true, message: "Account already exists" });
				return;
			}
			next();
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
		res.status(404).send({ accountExists: false, message: "Account doesn't exists" });
	});
}

module.exports = { checkAccountExists, checkAccountNotExists };
