require('dotenv').config();
const express = require('express');
// const queryParser = require('qs');
const ticketDAO = require('../daos/ticketDAO.js');
const router = express.Router();
const { authorize, authorizeManager } = require('./auth.js');
const MANAGER_ROLE = process.env.MANAGER_ROLE;
const PENDING_TICKET_STATUS = process.env.PENDING_TICKET_STATUS;

router.get('/?status=pending', authorize, async (req, res) => {

});

router.post('/', authorize, async (req, res) => {
	try {
		await ticketDAO.createTicket(req.body.amount, req.body.description);
		res.sendStatus(201);
	} catch (err) {
		res.sendStatus(500);
		console.error(err);
	}
});

async function setTicketStatus(req, res, setter) {
	// if (req.user.role !== MANAGER_ROLE) {
	// 	res.sendStatus(403);
	// } else {
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
	// }
}

// router.post('/:id/approve', authorize, async (req, res) => {
// 	setTicketStatus(req, res, ticketDAO.approveTicket);
// });

// router.post('/:id/deny', authorize, async (req, res) => {
// 	setTicketStatus(req, res, ticketDAO.denyTicket);
// });

router.post('/:id/approve', authorizeManager, async (req, res) => {
	setTicketStatus(req, res, ticketDAO.approveTicket);
});

router.post('/:id/deny', authorizeManager, async (req, res) => {
	setTicketStatus(req, res, ticketDAO.denyTicket);
});


module.exports = router;