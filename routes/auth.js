const express = require('express');
const userDAO = require('../daos/userDAO.js');
const router = express.Router();

router.post('/register', async (req, res) => {
	try {
		let data = await userDAO.getUserByUsername(req.body.username);

		if (data.Items.length > 0) {
			res.sendStatus(409);
		} else {
			// console.log(await createUser(req.body.username, req.body.password));
			await userDAO.createUser(req.body.username, req.body.password);
			res.sendStatus(201);
		}
	} catch (err) {
		res.sendStatus(500);
		console.error(err);
	}
});

module.exports = router;