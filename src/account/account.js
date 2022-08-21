const redis = require("redis-om");
const bcrypt = require("bcrypt");

const { client, connect } = require("../../config/redis");

const Entity = redis.Entity;
const Schema = redis.Schema;

class Account extends Entity {}

let accountSchema = new Schema(
	Account,
	{
		name: { type: "string" },
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
		const accountRepo = client.fetchRepository(accountSchema);
		const account = accountRepo.createEntity(data);
		const id = await accountRepo.save(account);
		return id;
	} catch (error) {
		console.log("Error creating account", error);
	}
}

async function getAccountById(id) {
	await connect();
	const accountRepo = client.fetchRepository(accountSchema);
	const account = await accountRepo.fetch(id);
	return account;
}

async function getAccountByEmail(email) {
	await connect();
	const accountRepo = client.fetchRepository(accountSchema);
	const account = await accountRepo.search().where("email").equals(email).return.first();
	return account;
}

async function createIndex() {
	await connect();
	const repo = client.fetchRepository(accountSchema);
	await repo.createIndex();
}

createIndex();

module.exports = { createAccount, getAccountById, getAccountByEmail, createIndex };
