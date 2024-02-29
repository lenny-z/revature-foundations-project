require('dotenv').config();
const ticketDAO = require('../daos/ticketDAO.js');
const PENDING_TICKET_STATUS = process.env.PENDING_TICKET_STATUS;
const APPROVED_TICKET_STATUS = process.env.APPROVED_TICKET_STATUS;
const DENIED_TICKET_STATUS = process.env.DENIED_TICKET_STATUS;

test('createTicket, managerGetPendingTickets, and employeeGetTickets', async () => {
	const submitterID = Math.random().toString(36);
	const amount = Math.random() * 100;
	const description = Math.random().toString(36);
	await ticketDAO.createTicket(submitterID, amount, description);
	let tickets = (await ticketDAO.managerGetPendingTickets()).Items;
	let ticket = tickets.find(ticket => {
		ticket.submitterID === submitterID &&
			ticket.amount === amount &&
			ticket.description === description
	});
	expect(ticket).not.toBeNull();
	tickets = (await ticketDAO.employeeGetTickets(submitterID)).Items;
	ticket = tickets.find(ticket => {
		ticket.submitterID === submitterID &&
			ticket.amount === amount &&
			ticket.description === description
	});
	expect(ticket).not.toBeNull();
});

async function testTicketStatusSetter(status, setter) {
	let data = await ticketDAO.managerGetPendingTickets();
	const tickets = data.Items;
	const randomTicket = tickets[Math.floor(Math.random() * tickets.length)];
	data = await setter(randomTicket.id);
	console.log(data);
	expect(data.httpStatusCode).toBe(200);
	data = await setter(randomTicket.id);
	console.log(data);
	expect(data.httpStatusCode).toBe(400);
	// data = await ticketDAO.getTicketsByStatus(status);
	// const ticket = data.Items.find(
	// 	ticket => ticket.id === randomTicket.id && ticket.status === status
	// );
	// expect(ticket).not.toBeUndefined();
}

test('approveTicket', async () => {
	testTicketStatusSetter(APPROVED_TICKET_STATUS, ticketDAO.approveTicket);
});

test('denyTicket', async () => {
	testTicketStatusSetter(DENIED_TICKET_STATUS, ticketDAO.denyTicket);
});