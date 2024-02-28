require('dotenv').config();
const express = require('express');
const ticketDAO = require('../daos/ticketDAO.js');
const router = express.Router();
const { authorize, authorizeManager } = require('./auth.js');
const MANAGER_ROLE = process.env.MANAGER_ROLE;
const EMPLOYEE_ROLE = process.env.EMPLOYEE_ROLE;
const PENDING_TICKET_STATUS = process.env.PENDING_TICKET_STATUS;

router.get('/', authorize, async (req, res) => {
	if (req.user.role === MANAGER_ROLE && req.query.status === 'pending') {
		try {
			// res.status(200).json(await ticketDAO.getTicketsByStatus(PENDING_TICKET_STATUS));
			res.status(200).json(await ticketDAO.managerGetPendingTickets());
		} catch (err) {
			res.sendStatus(500);
			console.error(err);
		}
	} else if (req.user.role === EMPLOYEE_ROLE) {
		try {
			res.status(200).json(await ticketDAO.employeeGetTickets(req.user.id));
		} catch (err) {
			res.sendStatus(500);
			console.error(err);
		}
	}
	// if (req.query.status === 'pending') {
	// try {
	// 	res.status(200).json(await ticketDAO.getTicketsByStatus(PENDING_TICKET_STATUS));
	// } catch (err) {
	// 	res.sendStatus(500);
	// 	console.error(err);
	// }
	// else {
	// 	res.sendStatus(400);
	// }
});

router.post('/', authorize, async (req, res) => {
	if (!req.body || !req.body.amount || !req.body.description) {
		res.sendStatus(400);
		return;
	}

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