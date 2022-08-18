const passport = require("passport");

const { createAccount, getAccountById } = require("./account");
const { checkAuthenticated, checkNotAuthenticated } = require("../middleware/auth");
const router = require("express").Router();

router.post("/account", checkNotAuthenticated, async (req, res) => {
	const body = req.body;
	const data = await createAccount(body);
	res.send(data).status(200);
});

router.get("/account/:id", async (req, res) => {
	const id = req.params.id;
	const data = await getAccountById(id);
	res.send(data).status(200);
});

router.post(
	"/login",
	checkNotAuthenticated,
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/account/login",
	})
);

router.delete("/logout", (req, res, next) => {
	req.logOut((err) => {
		if (err) {
			return next(err);
		}

		res.redirect("/account/login");
	});
});

module.exports = router;
