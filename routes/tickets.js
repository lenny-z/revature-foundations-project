require('dotenv').config();
const express = require('express');
const ticketDAO = require('../daos/ticketDAO.js');
const router = express.Router();
const { authorize } = require('./auth.js');
const MANAGER_ROLE = process.env.MANAGER_ROLE;

router.post('/', authorize, async (req, res) => {
	try {
		await ticketDAO.createTicket(req.body.amount, req.body.description);
		res.sendStatus(201);
	} catch (err) {
		res.sendStatus(500);
		console.error(err);
	}
});

router.post('/:id/approve/', authorize, async (req, res) => {
	console.log(req.user);
	if (req.user.role !== MANAGER_ROLE) {
		res.sendStatus(403);
	} else {
		try {
			ticketDAO.getTicketByID(req.params.id);
			// await approveTicket(req.params.id);
			res.sendStatus(200);
		} catch (err) {
			res.sendStatus(500);
			console.error(err);
		}
	}
});

module.exports = router;