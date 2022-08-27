const category = require("./category");
const router = require("express").Router();

router.post("/category", async (req, res) => {
	const body = req.body;
	const data = await category.createCategory(body);
	res.send(data).status(200);
});

router.get("/category", async (req, res) => {
	const data = await category.getAllCategory();
	res.send(data).status(200);
});

router.get("/category/:id", async (req, res) => {
	const id = req.params.id;
	const data = await category.getCategoryById(id);
	res.send(data).status(200);
});

router.put("/category/:id", async (req, res) => {
	const id = req.params.id;
	const body = req.body;
	const data = await category.updateCategoryById(id, body);
	res.send(data).status(200);
});

module.exports = router;
