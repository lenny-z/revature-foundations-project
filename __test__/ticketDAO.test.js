require('dotenv').config();
const ticketDAO = require('../daos/ticketDAO.js');
const PENDING_TICKET_STATUS = process.env.PENDING_TICKET_STATUS;
const APPROVED_TICKET_STATUS = process.env.APPROVED_TICKET_STATUS;

test('createTicket', async () => {
	const amount = Math.random() * 100;
	const description = Math.random().toString(36);
	await ticketDAO.createTicket(amount, description);
	const data = await ticketDAO.getTicketsByStatus(PENDING_TICKET_STATUS);
	const ticket = data.Items.find(
		ticket => ticket.amount === amount && ticket.description === description
	);
	expect(ticket).not.toBeNull();
});

test('approveTicket', async () => {
	let data = await ticketDAO.getTicketsByStatus(PENDING_TICKET_STATUS);
	console.log(data.Items);
	const tickets = data.Items;
	// const randomTicket = tickets[0];
	// console.log(Math.floor(Math.random() * tickets.length));
	const randomTicket = tickets[Math.floor(Math.random() * tickets.length)];
	// console.log(randomTicket);
	await ticketDAO.approveTicket(randomTicket.id);
	data = await ticketDAO.getTicketsByStatus(APPROVED_TICKET_STATUS);
	console.log(data);
	const ticket = data.Items.find(
		ticket => ticket.id === randomTicket.id && ticket.status === APPROVED_TICKET_STATUS
	);
	expect(ticket).not.toBeNull();
});