const express = require("express");
const config = require("./config");
const app = express();

app.get("/", (req, res) => {
	res.send("It's working");
});

app.listen(config.port, () => {
	console.log(`Server running at PORT:${config.port}`);
});
