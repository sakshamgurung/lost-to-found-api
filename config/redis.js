const Client = require("redis-om").Client;

const client = new Client();

async function connect() {
	if (!client.isOpen()) {
		await client.open(process.env.REDIS_URL);
	}
}

module.exports = { connect, client };
