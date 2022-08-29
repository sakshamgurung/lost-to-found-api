const submission = require("./submission");
const { checkAuthenticated } = require("../middleware/auth");
const router = require("express").Router();

router.post("/submission", checkAuthenticated, async (req, res) => {
	const body = req.body;
	const data = await submission.createSubmission(body);
	res.send(data).status(200);
});

router.get("/submission/user/:id", checkAuthenticated, async (req, res) => {
	const id = req.params.id;
	const data = await submission.getAllSubmissionByUser(id);
	res.send(data).status(200);
});

router.get("/submission/near/loc", checkAuthenticated, async (req, res) => {
	const { latitude, longitude, excludeUserId, submissionType } = req.body;
	const data = await submission.getSubmissionByNearestLocation(excludeUserId, submissionType, {
		longitude,
		latitude,
	});
	res.send(data).status(200);
});

router.get("/submission/date/latest", checkAuthenticated, async (req, res) => {
	const { excludeUserId, submissionType } = req.query;
	const data = await submission.getSubmissionByLatestDate(excludeUserId, submissionType);
	res.send(data).status(200);
});

router.get("/submission/category", checkAuthenticated, async (req, res) => {
	const { category, excludeUserId, submissionType } = req.query;
	const data = await submission.searchSubmissionsByCategory(
		excludeUserId,
		submissionType,
		category
	);
	res.send(data).status(200);
});

router.get("/submission/search", checkAuthenticated, async (req, res) => {
	const { search, excludeUserId, submissionType } = req.query;
	const data = await submission.searchSubmissionsByFullText(excludeUserId, submissionType, search);
	res.send(data).status(200);
});

router.get("/submission/:id", checkAuthenticated, async (req, res) => {
	const id = req.params.id;
	const data = await submission.getSubmissionById(id);
	res.send(data).status(200);
});

router.put("/submission/:id", checkAuthenticated, async (req, res) => {
	const id = req.params.id;
	const body = req.body;
	const data = await submission.updateSubmissionById(id, body);
	res.send(data).status(200);
});

router.delete("/submission/:id", checkAuthenticated, async (req, res) => {
	const id = req.params.id;
	const data = await submission.deleteSubmissionById(id);
	res.send(data).status(200);
});

module.exports = router;
