const bcrypt = require("bcrypt");

const { getAccountByEmail, getAccountById } = require("../src/account/account");

async function verify(email, password, res) {
	try {
		const account = await getAccountByEmail(email);
		if (await bcrypt.compare(password, account.password)) {
			return account;
		} else {
			return res.send({ message: "Incorrect password" }).status(403);
		}
	} catch (error) {
		console.log("Error verifying login (server):", error);
		res.send({ message: "Server error" }).status(500);
	}
}

async function verifyToken(entityId, token, res) {
	try {
		const account = await getAccountById(entityId);
		const tokens = account.tokens;
		if (tokens !== null && account.tokens.includes(token)) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		console.log("Error verifying token (server):", error);
		res.send({ message: "Server error" }).status(500);
	}
}

module.exports = { verify, verifyToken };
