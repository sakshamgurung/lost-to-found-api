const passport = require("passport");

const account = require("./account");
const { checkAuthenticated, checkNotAuthenticated } = require("../middleware/auth");
const { checkAccountExists } = require("../middleware/account");
const router = require("express").Router();

router.post("/account", [checkNotAuthenticated, checkAccountExists], async (req, res) => {
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
	res.send(data).status(200);
});

router.post("/login", checkNotAuthenticated, (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			return res.status(400).send({ error: err, isAuth: false });
		}

		if (!user) {
			return res.status(400).send({ ...info, isAuth: false });
		}

		req.logIn(user, function (err) {
			if (err) {
				return next(err);
			}
			return res.send({ isAuth: true });
		});
	})(req, res, next);
});

router.delete("/logout", checkAuthenticated, (req, res, next) => {
	req.logOut((err) => {
		if (err) {
			return next(err);
		}

		res.send({ isAuth: false });
	});
});

module.exports = router;
