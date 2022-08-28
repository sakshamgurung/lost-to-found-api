const fs = require("fs");

const redis = require("redis-om");

const { client, connect } = require("../../config/redis");

const Entity = redis.Entity;
const Schema = redis.Schema;

class Submission extends Entity {}

let submissionSchema = new Schema(
	Submission,
	{
		userId: { type: "string" },
		type: { type: "string" },
		status: { type: "string" },
		date: { type: "date", sortable: true },
		category: { type: "string" },
		itemName: { type: "string" },
		location1: { type: "point" },
		location2: { type: "point" },
		location3: { type: "point" },
		description: { type: "text" },
		email: { type: "string" },
		imageUrl: { type: "string[]" },
	},
	{
		dataStructure: "JSON",
	}
);

async function createSubmission(data) {
	try {
		await connect();
		const submissionRepo = client.fetchRepository(submissionSchema);
		const submission = submissionRepo.createEntity(data);
		const id = await submissionRepo.save(submission);
		return id;
	} catch (error) {
		console.log("Error creating submission", error);
	}
}

async function getSubmissionById(id) {
	await connect();
	const submissionRepo = client.fetchRepository(submissionSchema);
	const submission = await submissionRepo.fetch(id);
	return submission;
}

async function getAllSubmissionByUser(userId) {
	await connect();
	const submissionRepo = client.fetchRepository(submissionSchema);
	const submissions = await submissionRepo.search().where("userId").equals(userId).return.all();
	return submissions;
}

async function getSubmissionByNearestLocation(excludeUserId, submissionType, location) {
	await connect();
	const submissionRepo = client.fetchRepository(submissionSchema);
	const submissions = await submissionRepo
		.search()
		.where("userId")
		.does.not.equal(excludeUserId)
		.where("type")
		.equals(submissionType)
		.where("location1")
		.inRadius((circle) => circle.origin(location).radius(50).kilometers)
		.return.all();
	return submissions;
}

async function getSubmissionByLatestDate(excludeUserId, submissionType) {
	await connect();
	const submissionRepo = client.fetchRepository(submissionSchema);
	const submissions = await submissionRepo
		.search()
		.where("userId")
		.does.not.equal(excludeUserId)
		.where("type")
		.equals(submissionType)
		.sortBy("date", "DESC")
		.return.all();
	return submissions;
}

async function updateSubmissionById(id, data) {
	try {
		await connect();
		const submissionRepo = client.fetchRepository(submissionSchema);
		const submission = await submissionRepo.fetch(id);
		submission.type = data.type ?? null;
		submission.status = data.status ?? null;
		submission.date = data.date ?? null;
		submission.category = data.category ?? null;
		submission.itemName = data.itemName ?? null;
		submission.location1 = data.location1 ?? null;
		submission.location2 = data.location2 ?? null;
		submission.location3 = data.location3 ?? null;
		submission.description = data.description ?? null;
		submission.email = data.email ?? null;
		submission.imageUrl = data.imageUrl ?? null;
		await submissionRepo.save(submission);
		return submission;
	} catch (error) {
		console.log("Error updating submission");
	}
}

async function deleteSubmissionById(id) {
	try {
		await connect();
		const submissionRepo = client.fetchRepository(submissionSchema);
		const submission = await submissionRepo.fetch(id);
		submission.imageUrl.forEach((i) => {
			fs.unlink(`${__dirname}/../../upload/images/${i}`, (err) => {
				if (err) return console.log("Error deleting image file: ", err);
			});
		});
		await submissionRepo.remove(id);
		return id;
	} catch (error) {
		console.log("Error deleting submission: ", error);
	}
}

async function createIndex() {
	await connect();
	const repo = client.fetchRepository(submissionSchema);
	await repo.createIndex();
}

createIndex();

module.exports = {
	createIndex,
	createSubmission,
	getAllSubmissionByUser,
	getSubmissionByNearestLocation,
	getSubmissionByLatestDate,
	getSubmissionById,
	updateSubmissionById,
	deleteSubmissionById,
};
