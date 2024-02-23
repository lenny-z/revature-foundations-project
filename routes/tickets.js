const express = require('express');
const ticketDAO = require('../daos/ticketDAO.js');
const router = express.Router();
const { authorize } = require('./auth.js');

router.post('/', authorize, async (req, res) => {
	try {
		await ticketDAO.createTicket(req.body.amount, req.body.description);
		res.sendStatus(201);
	} catch (err) {
		res.sendStatus(500);
		console.error(err);
	}
});

module.exports = router;