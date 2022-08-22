const router = require("express").Router();
const jwtToken = require("jsonwebtoken");

const config = require("../../config");
const account = require("./account");
const { checkAuthenticated, checkNotAuthenticated } = require("../middleware/auth");
const { checkAccountExists, checkAccountNotExists } = require("../middleware/account");
const verify = require("../../util/verify").verify;

router.post("/account", [checkNotAuthenticated, checkAccountNotExists], async (req, res) => {
	const body = req.body;
	const data = await account.createAccount(body);
	res.send(data).status(200);
});

router.get("/account/isAuth", checkAuthenticated, (req, res) => {
	res.send({ isAuth: true }).status(200);
});

router.get("/account/:id", checkAuthenticated, async (req, res) => {
	const id = req.params.id;
	const data = await account.getAccountById(id);
	data.password = null;
	res.send(data).status(200);
});

router.post("/login", [checkNotAuthenticated, checkAccountExists], async (req, res) => {
	const { email, password } = req.body;
	const verifiedAcc = await verify(email, password, res);
	const authToken = jwtToken.sign(
		{
			entityId: verifiedAcc.entityId,
			email: verifiedAcc.email,
			name: verifiedAcc.name,
			createdDate: new Date().toISOString(),
		},
		config.jwtSecret
	);

	verifiedAcc.tokens = [authToken];
	const data = await account.updateAccountById(verifiedAcc.entityId, verifiedAcc);
	res.send({ isAuth: true, tokens: data.tokens }).status(200);
});

router.delete("/logout", checkAuthenticated, async (req, res, next) => {
	const { entityId } = req.auth;
	const acc = await account.getAccountById(entityId);
	acc.tokens = null;
	await account.updateAccountById(entityId, acc);
	res.send({ isAuth: false }).status(200);
});

module.exports = router;
