require('dotenv').config();
const express = require('express');
const ticketDAO = require('../daos/ticketDAO.js');
const router = express.Router();
const { authorize, authorizeManager } = require('./auth.js');
const PENDING_TICKET_STATUS = process.env.PENDING_TICKET_STATUS;

router.get('/', authorizeManager, async (req, res) => {
	if (req.query.status === 'pending') {
		try {
			res.status(200).json(await ticketDAO.getTicketsByStatus(PENDING_TICKET_STATUS));
		} catch (err) {
			res.sendStatus(500);
			console.error(err);
		}
	} else {
		res.sendStatus(400);
	}
});

router.post('/', authorize, async (req, res) => {
	try {
		await ticketDAO.createTicket(req.user.id, req.body.amount, req.body.description);
		res.sendStatus(201);
	} catch (err) {
		res.sendStatus(500);
		console.error(err);
	}
});

async function setTicketStatus(req, res, setter) {
	try {
		const ticket = (await ticketDAO.getTicketByID(req.params.id)).Item;

		if (ticket.status === PENDING_TICKET_STATUS) {
			await setter(req.params.id);
			res.sendStatus(200);
		} else {
			res.status(400).json({ error: 'TICKET NOT PENDING' });
		}
	} catch (err) {
		res.sendStatus(500);
		console.error(err);
	}
}

router.post('/:id/approve', authorizeManager, async (req, res) => {
	setTicketStatus(req, res, ticketDAO.approveTicket);
});

router.post('/:id/deny', authorizeManager, async (req, res) => {
	setTicketStatus(req, res, ticketDAO.denyTicket);
});


module.exports = router;