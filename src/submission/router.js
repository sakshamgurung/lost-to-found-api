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
	const { latitude, longitude } = req.query;
	const data = await submission.getSubmissionByNearestLocation({ longitude, latitude });
	res.send(data).status(200);
});

router.get("/submission/date/latest", checkAuthenticated, async (req, res) => {
	const data = await submission.getSubmissionByLatestDate();
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
