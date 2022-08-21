const dotenv = require("dotenv").config();

module.exports = {
	port: parseInt(process.env.PORT, 10) || 5000,
	sessionSecret: process.env.SESSION_SECRET,
	jwtSecret: process.env.JWT_SECRET,
};
