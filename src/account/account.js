const redis = require("redis-om");

const { client, connect } = require("../../config/redis");

const Entity = redis.Entity;
const Schema = redis.Schema;

class Account extends Entity {}

let accountSchema = new Schema(
	Account,
	{
		username: { type: "string" },
		email: { type: "string" },
		password: { type: "string" },
	},
	{
		dataStructure: "JSON",
	}
);

async function createAccount(data) {
	try {
		await connect();
		const hashPassword = await bcrypt.hash(data.password, 12);
		data.password = hashPassword;
		const accountRepository = client.fetchRepository(accountSchema);
		const account = accountRepository.createEntity(data);
		const id = await accountRepository.save(account);
	} catch (error) {
		console.log("Error creating account", error);
	}
	return id;
}

async function getAccountById(id) {
	await connect();
	const accountRepository = client.fetchRepository(accountSchema);
	const account = await accountRepository.fetch(id);
	return account;
}

async function getAccountByEmail(email) {
	await connect();
	const accountRepository = client.fetchRepository(accountSchema);
	const account = await accountRepository.search().where("email").equals(email).return.first();
	return account;
}

async function createIndex() {
	await connect();
	const repo = client.fetchRepository(accountSchema);
	await repo.createIndex();
}

createIndex();

module.exports = { createAccount, getAccountById, getAccountByEmail, createIndex };
