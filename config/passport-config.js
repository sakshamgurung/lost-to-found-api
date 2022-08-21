const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

const { getAccountByEmail, getAccountById } = require("../src/account/account");

async function verify(email, password, done) {
	try {
		const account = await getAccountByEmail(email);
		if (account == null) {
			return done(null, false, { message: "Account doesn't exists" });
		}
		if (await bcrypt.compare(password, account.password)) {
			return done(null, account);
		} else {
			return done(null, false, { message: "Incorrect email or password" });
		}
	} catch (error) {
		console.log("Error login (server):", error);
		return done(error);
	}
}

function init(passport) {
	passport.use(new LocalStrategy({ usernameField: "email" }, verify));
	passport.serializeUser((account, done) => done(null, account.entityId));
	passport.deserializeUser((entityId, done) => {
		return done(null, getAccountById(entityId));
	});
}

module.exports = { init };
