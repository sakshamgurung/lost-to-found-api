const redis = require("redis-om");

const { client, connect } = require("../../config/redis");

const Entity = redis.Entity;
const Schema = redis.Schema;

class Category extends Entity {}

let categorySchema = new Schema(
	Category,
	{
		name: { type: "string" },
		description: { type: "text" },
	},
	{
		dataStructure: "JSON",
	}
);

async function createCategory(data) {
	try {
		await connect();
		const categoryRepo = client.fetchRepository(categorySchema);
		const category = categoryRepo.createEntity(data);
		const id = await categoryRepo.save(category);
		return id;
	} catch (error) {
		console.log("Error creating category", error);
	}
}

async function getCategoryById(id) {
	await connect();
	const categoryRepo = client.fetchRepository(categorySchema);
	const category = await categoryRepo.fetch(id);
	return category;
}

async function getAllCategory() {
	await connect();
	const categoryRepo = client.fetchRepository(categorySchema);
	const categories = await categoryRepo.search().return.all();
	return categories;
}

async function updateCategoryById(id, data) {
	try {
		await connect();
		const categoryRepo = client.fetchRepository(categorySchema);
		const category = await categoryRepo.fetch(id);
		category.name = data.name ?? null;
		category.description = data.description ?? null;
		await categoryRepo.save(category);
		return category;
	} catch (error) {
		console.log("Error updating category");
	}
}

async function createIndex() {
	await connect();
	const repo = client.fetchRepository(categorySchema);
	await repo.createIndex();
}

createIndex();

module.exports = {
	createIndex,
	createCategory,
	getAllCategory,
	getCategoryById,
	updateCategoryById,
};
