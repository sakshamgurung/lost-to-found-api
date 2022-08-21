const account = require("../account/account");

function checkAccountExists(req, res, next) {
	const { email } = req.body;
	account.getAccountByEmail(email).then((acc) => {
		console.log("Acc exits", acc != null);
		if (acc != null) {
			return res.send({ accountExists: true }).status(400);
		}
		next();
	});
}

module.exports = { checkAccountExists };
